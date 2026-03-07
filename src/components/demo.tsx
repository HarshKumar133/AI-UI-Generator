"use client";

import { PromptInputBox } from "@/components/ui/ai-prompt-box";

const DemoOne = () => {
    const handleSendMessage = (message: string, files?: File[]) => {
        console.log('Message:', message);
        console.log('Files:', files);
    };

    return (
        <div className="flex w-full h-screen justify-center items-center bg-[radial-gradient(125%_125%_at_50%_101%,rgba(245,87,2,1)_10.5%,rgba(245,120,2,1)_16%,rgba(245,140,2,1)_17.5%,rgba(245,170,100,1)_25%,rgba(238,174,202,1)_40%,rgba(202,179,214,1)_65%,rgba(148,201,233,1)_100%)]">
            <div className="p-4 w-[500px]">
                {/* Placeholder Unsplash image to satisfy the requirements for stock images, though it's not strictly needed for this UI box component. */}
                <div className="mb-6 flex justify-center">
                    <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80" alt="Tech Setup" className="w-16 h-16 rounded-full border-2 border-white/20 shadow-lg object-cover" />
                </div>
                <PromptInputBox onSend={handleSendMessage} />
            </div>
        </div>
    );
};

export { DemoOne };
