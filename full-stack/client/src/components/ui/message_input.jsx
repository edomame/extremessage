import { useState } from "react";

const MessageInput = () => {
    const [message, setMessage] = useState("");
    const maxChars = 1000;
    const tooLong = message.length > maxChars;

    // To add when working on messages
    // if (!newChannelName.trim()) return;

    return (
        <div className="w-full">
        <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-green-400 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-write-message"
            type="text"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
        />
        <span className={`text-sm ${tooLong ? "text-red-500" : "text-gray-500"} mt-1 block text font-bold`}>
            {message.length} / {maxChars} characters
        </span>
        </div>
    );
};
MessageInput.displayName = "MessageInput"

export { MessageInput }