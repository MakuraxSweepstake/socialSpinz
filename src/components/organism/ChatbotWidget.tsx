"use client"

import { useGetChatbotSettingQuery } from '@/services/settingApi';
import { Button, Typography } from '@mui/material';
import Image from 'next/image';

export default function ChatbotWidget() {
    const { data } = useGetChatbotSettingQuery();
    const chatbot = data?.data;

    // Script mode — widget rendered by the injected script (see ChatbotScriptLoader in root layout)
    if (chatbot?.chatbot_type === 'script') return null;

    // Link mode — only show if label is set
    const fileUrl = chatbot?.chatbot_image_url;
    const label = chatbot?.chatbot_label;
    const isVideo = fileUrl?.toLowerCase().endsWith('.mp4');

    if (!label) return null;

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
                    {fileUrl && isVideo ? (
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
                            src={fileUrl ? fileUrl : ""}
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
