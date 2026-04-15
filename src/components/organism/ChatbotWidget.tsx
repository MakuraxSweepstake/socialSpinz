"use client"

import { useGetChatbotSettingQuery } from '@/services/settingApi';
import { Button, Typography } from '@mui/material';
import Image from 'next/image';
import Script from 'next/script';
import { useMemo } from 'react';

// ─── Script parser ────────────────────────────────────────────────────────────

type ParsedScript = { src?: string; id?: string; inline?: string };

/** Strip Next.js JSX template-literal wrapper: {`…`} → … */
function stripJSXWrapper(content: string): string {
    return content.replace(/^\s*\{`([\s\S]*?)`\}\s*$/, "$1").trim();
}

/** Extract <script> / <Script> tags from a pasted embed string */
function parseScriptTags(html: string): ParsedScript[] {
    const results: ParsedScript[] = [];
    const tagRe = /<[Ss]cript([^>]*)>([\s\S]*?)<\/[Ss]cript\s*>/gi;
    let m: RegExpExecArray | null;
    while ((m = tagRe.exec(html)) !== null) {
        const attrsStr = m[1];
        const inline = stripJSXWrapper(m[2].trim());
        const getAttr = (name: string) =>
            attrsStr.match(new RegExp(`\\b${name}=["']([^"']*)["']`, "i"))?.[1];
        results.push({ src: getAttr("src"), id: getAttr("id"), inline: inline || undefined });
    }
    return results;
}

// ─── Widget ───────────────────────────────────────────────────────────────────

export default function ChatbotWidget() {
    const { data } = useGetChatbotSettingQuery();
    const chatbot = data?.data;

    const scripts = useMemo(
        () => (chatbot?.chatbot_type === 'script' && chatbot.chatbot_script_code
            ? parseScriptTags(chatbot.chatbot_script_code)
            : []),
        [chatbot?.chatbot_type, chatbot?.chatbot_script_code]
    );

    // ── Script mode: let the injected scripts render their own widget ──────────
    if (chatbot?.chatbot_type === 'script') {
        return (
            <>
                {scripts.map((s, i) =>
                    s.src ? (
                        <Script
                            key={s.src}
                            src={s.src}
                            id={s.id ?? `chatbot-ext-${i}`}
                            strategy="afterInteractive"
                        />
                    ) : (
                        <Script
                            key={s.id ?? `chatbot-inline-${i}`}
                            id={s.id ?? `chatbot-inline-${i}`}
                            strategy="afterInteractive"
                            dangerouslySetInnerHTML={{ __html: s.inline ?? "" }}
                        />
                    )
                )}
            </>
        );
    }

    // ── Link mode: floating button ─────────────────────────────────────────────
    const fileUrl = chatbot?.chatbot_image_url;
    const label = chatbot?.chatbot_label;
    const isVideo = fileUrl?.toLowerCase().endsWith('.mp4');

    if (!label) return null;

    return (
        <div className="fixed bottom-1 right-2 lg:bottom-2 lg:right-4 z-50">
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
                    ) : fileUrl ? (
                        <Image
                            src={fileUrl}
                            alt="chatbot"
                            width={44}
                            height={44}
                            className="rounded-full object-cover"
                        />
                    ) : null}
                    <Typography variant="subtitle2">{label}</Typography>
                </div>
            </Button>
        </div>
    );
}
