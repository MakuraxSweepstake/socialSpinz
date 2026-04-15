"use client"

import { useGetChatbotSettingQuery } from '@/services/settingApi';
import { Button, Typography } from '@mui/material';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

export default function ChatbotWidget() {
    const { data } = useGetChatbotSettingQuery();
    const scriptInjected = useRef(false);

    const chatbot = data?.data;
    const isScript = chatbot?.chatbot_type === 'script';

    useEffect(() => {
        if (!isScript || !chatbot?.chatbot_script_code || scriptInjected.current) return;

        scriptInjected.current = true;

        const container = document.createElement('div');
        container.innerHTML = chatbot.chatbot_script_code;

        const scripts = container.querySelectorAll('script');
        scripts.forEach((originalScript) => {
            const script = document.createElement('script');
            Array.from(originalScript.attributes).forEach((attr) => {
                script.setAttribute(attr.name, attr.value);
            });
            if (originalScript.textContent) {
                script.textContent = originalScript.textContent;
            }
            document.head.appendChild(script);
        });

        return () => {
            scripts.forEach((originalScript) => {
                const id = originalScript.getAttribute('id');
                if (id) document.getElementById(id)?.remove();
            });
        };
    }, [isScript, chatbot?.chatbot_script_code]);

    // Script mode — injected script renders its own widget
    if (isScript) return null;

    // Link mode — only show if both image and label are set
    const fileUrl = chatbot?.chatbot_image_url;
    const label = chatbot?.chatbot_label;
    const isVideo = fileUrl?.toLowerCase().endsWith('.mp4');

    if (!fileUrl || !label) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <Button
                className="max-w-fit px-8!"
                variant="contained"
                color="primary"
                LinkComponent="a"
                href={chatbot?.chatbot_link || ""}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ justifyContent: "start" }}
            >
                <div className="w-full flex! justify-start! items-center! gap-4">
                    {isVideo ? (
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-11 h-11 rounded-full object-cover"
                        >
                            <source src={fileUrl} type="video/mp4" />
                        </video>
                    ) : (
                        <Image
                            src={fileUrl}
                            alt="chatbot"
                            width={44}
                            height={44}
                            className="rounded-full object-cover"
                        />
                    )}
                    <Typography variant="subtitle2">
                        {label}
                    </Typography>
                </div>
            </Button>
        </div>
    );
}
