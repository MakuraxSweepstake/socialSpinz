import { getChatbotSetting } from "@/serverApi/game";
import Script from "next/script";

type ParsedScript = {
    src?: string;
    id?: string;
    inline?: string;
};

/**
 * Strip JSX template-literal wrapper that users may paste from Next.js examples:
 *   {`  window.foo = ...  `}  →  window.foo = ...
 */
function stripJSXWrapper(content: string): string {
    return content.replace(/^\s*\{`([\s\S]*?)`\}\s*$/, "$1").trim();
}

/**
 * Parse plain-HTML or Next.js-JSX embed code into discrete script descriptors.
 * Handles both <script> (HTML) and <Script> (JSX) tag names.
 */
function parseScriptTags(html: string): ParsedScript[] {
    const results: ParsedScript[] = [];

    // Match opening <script …> or <Script …>, capture body, then closing tag.
    const scriptTagRegex = /<[Ss]cript([^>]*)>([\s\S]*?)<\/[Ss]cript\s*>/gi;
    let match: RegExpExecArray | null;

    while ((match = scriptTagRegex.exec(html)) !== null) {
        const attrsStr = match[1];
        let inline = match[2].trim();

        // Strip JSX {`…`} wrapper if present
        inline = stripJSXWrapper(inline);

        const getAttr = (name: string) => {
            const m = attrsStr.match(new RegExp(`\\b${name}=["']([^"']*)["']`, "i"));
            return m?.[1];
        };

        results.push({
            src: getAttr("src"),
            id: getAttr("id"),
            inline: inline || undefined,
        });
    }

    return results;
}

export default async function ChatbotScriptLoader() {
    try {
        const data = await getChatbotSetting();
        const chatbot = data?.data;

        if (chatbot?.chatbot_type !== "script" || !chatbot?.chatbot_script_code) {
            return null;
        }

        const scripts = parseScriptTags(chatbot.chatbot_script_code);

        return (
            <>
                {scripts.map((s, i) =>
                    s.src ? (
                        /*
                         * External script — afterInteractive is fine here.
                         * By the time this runs, inline config scripts (beforeInteractive)
                         * have already executed, so window.MakuraBotConfig etc. are set.
                         */
                        <Script
                            key={i}
                            src={s.src}
                            id={s.id ?? `chatbot-ext-${i}`}
                            strategy="afterInteractive"
                        />
                    ) : (
                        /*
                         * Inline config script — beforeInteractive guarantees it runs
                         * before the external widget script loads.
                         */
                        <Script
                            key={i}
                            id={s.id ?? `chatbot-inline-${i}`}
                            strategy="beforeInteractive"
                            dangerouslySetInnerHTML={{ __html: s.inline ?? "" }}
                        />
                    )
                )}
            </>
        );
    } catch {
        return null;
    }
}
