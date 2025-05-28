'use client'
import { cn, configureAssistant, getSubjectColor } from '@/lib/utils'
import { vapi } from '@/lib/vapi.sdk';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import Lottie, { LottieRefCurrentProps } from 'lottie-react'
import soundwaves from '@/constants/soundwaves.json'
import { addToSessionHistory } from '@/lib/actions/companion.actions';

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

const CompanionComponent = ({ companionId, subject, name, topic, userImage, userName, style, voice }: CompanionComponentProps) => {

    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
    const [isMuted, setIsMuted] = useState<boolean>(false)
    const [messages, setMessages] = useState<SavedMessage[]>([]);

    const lottieRef = useRef<LottieRefCurrentProps>(null);

    const toggleMicrophone = () => {
        try {
            const isMute = vapi.isMuted()
            vapi.setMuted(!isMute);
            setIsMuted(!isMuted)
        } catch (error) {
            console.log(`Error toggling microphone: ${error}`);
            toast.error(`Try connecting to companion first`);
        }
    }

    const handleDisconnect = async () => {
        try {
            setCallStatus(CallStatus.FINISHED);
            vapi.stop();
            toast.success('Disconnected from companion');
        } catch (error) {
            toast.error(`${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    const handleConnect = async () => {
        try {
            toast.loading('Connecting to companion...');
            setCallStatus(CallStatus.CONNECTING);
            const assistantOverride = {
                variableValues: {
                    subject, topic, style
                },
                clientMessages: ['transcript'],
                serverMessages: []
            }

            //@ts-expect-error let it be
            vapi.start(configureAssistant(voice, style), assistantOverride)
            toast.dismiss();
            toast.success('Connected to companion');
        } catch (error) {
            toast.error(`${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    useEffect(() => {
        if(lottieRef){
            if (isSpeaking) lottieRef.current?.play();
            else lottieRef.current?.stop()
        }
    }, [isSpeaking, lottieRef])

    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE)
        const onCallEnd = () => {
            setCallStatus(CallStatus.FINISHED)
            addToSessionHistory(companionId)
        }
        const onMessage = (message: Message) => { 
            if (message.type === 'transcript' && message.transcriptType === 'final') {
                const newMessage = {
                    role: message.role,
                    content: message.transcript
                }
                setMessages(prev => [...prev, newMessage]);
            }
        }
        const onError = (error: Error) => {
            toast.error(`Error: ${error.message}`);
            setCallStatus(CallStatus.INACTIVE);
        }
        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);

        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('message', onMessage);
        vapi.on('error', onError);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);

        return () => {
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('message', onMessage);
            vapi.off('error', onError);
            vapi.off('speech-start', onSpeechStart);
            vapi.off('speech-end', onSpeechEnd);
        }
    }, [])

    return (
        <section className='flex flex-col h-[70vh]'>
            <section className='flex gap-8 max-sm:flex-col'>
                <div className='companion-section'>
                    <div className='companion-avatar' style={{ backgroundColor: getSubjectColor(subject) }}>
                        <div className={cn("absolute transition-opacity duration-1000", 
                            callStatus === CallStatus.FINISHED || callStatus === CallStatus.INACTIVE ? "opacity-1001" : "opacity-0",
                            callStatus === CallStatus.CONNECTING && "opacity-100 animate-pulse"
                        )}>
                        <Image
                            src={`/icons/${subject}.svg`}
                            alt="subject icon"
                            width={150}
                            height={150}
                            className='max-sm:w-fit'
                        />
                        </div>

                        <div className={cn("absolute transition-opacity duration-1000",
                            callStatus === CallStatus.ACTIVE ? "opacity-100" : "opacity-0"
                        )}>
                            <Lottie 
                                lottieRef={lottieRef} 
                                animationData={soundwaves}
                                autoplay={false}
                                className='companion-lottie'
                            />
                        </div>
                    </div>
                    <p className='text-2xl font-bold'>{name}</p>
                </div>
                <div className='user-section'>
                    <div className='user-avatar'    >
                        <Image src={userImage} alt={userName} width={130} height={130} className='rounded-full'/>
                        <p className='text-2xl font-bold'>{userName}</p>
                    </div>
                    <button className='btn-mic cursor-pointer' onClick={toggleMicrophone}>
                        <Image src={isMuted ? '/icons/mic-off.svg' : '/icons/mic-on.svg'}
                            alt='mic' width={36} height={36}
                        />
                        <p className='max-sm:hidden'>
                            {isMuted ? 'Turn on Mic' : 'Turn off Mic'}
                        </p>
                    </button>
                    <button 
                        onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleConnect}
                        className={cn('rounded-lg py-2 cursor-pointer transition-colors w-full text-white', 
                        callStatus === CallStatus.ACTIVE ? 'bg-red-500' : 'bg-primary', callStatus === CallStatus.CONNECTING && 'animate-pulse'
                    )}>
                        { callStatus === CallStatus.ACTIVE ? "End session ": callStatus === CallStatus.CONNECTING ? "Connecting...": "Start session" }
                    </button>
                </div>
            </section>
            <section className='transcript'>
                <div className='transcript-message no-scrollbar'>
                    {
                        messages.map((item, index) => {
                            if(item.role === 'assistant') {
                                return (
                                    <p key={index} className='max-sm:text-sm'>
                                        {name.split(' ')[0].replace('/[.,]/g', '')}: {item.content}
                                    </p>
                                )
                            } else {
                                return (<p className='text-primary max-sm:text-sm' key={index}>
                                    {userName} : {item.content}
                                </p> )
                            }
                        })
                    }
                </div>
                <div className='transcript-fade' style={{ opacity: callStatus === CallStatus.ACTIVE ? 1 : 0 }}/>
            </section>
        </section>
    )
}

export default CompanionComponent
