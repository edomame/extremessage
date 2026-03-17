import { useState } from "react";

const MessageInput = ({ onSend }) => {
    const [message, setMessage] = useState("");
    const maxChars = 1000;
    const tooLong = message.length > maxChars;

    const handleSend = () => {
        if (!message.trim() || tooLong) return;

        onSend?.(message);   // send to Dashboard
        setMessage("");      // clear input
    };

    return (
        <div className="w-full flex flex-col gap-2">
            <div className="flex gap-2">
                <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-green-400 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="text"
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSend();
                    }}
                />

                <button
                    onClick={handleSend}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 rounded"
                >
                    Send
                </button>
            </div>

            <span
                className={`text-sm ${
                    tooLong ? "text-red-500" : "text-gray-500"
                } font-bold`}
            >
                {message.length} / {maxChars} characters
            </span>
        </div>
    );
};
MessageInput.displayName = "MessageInput";

export { MessageInput };