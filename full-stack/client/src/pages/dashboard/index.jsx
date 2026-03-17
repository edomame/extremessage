import axios from "axios";
import { CHANNEL_ROUTE, HOST, USER_ROUTE, MESSAGE_ROUTE } from "@/lib/constants";
import { useState, useEffect, useRef } from "react";
import { MessageInput } from "../../components/ui/message_input.jsx";
import { ChannelList } from "../../components/ui/channel_list.jsx"
import { UserList } from "../../components/ui/user_list.jsx";
import { io } from "socket.io-client";

// Creates an axios instance with a server URL
const apiClient = axios.create({
  baseURL: HOST,
});

// const socket = io(HOST, {
//     auth: {
//         token: localStorage.getItem("token")
//     },
// });

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const Dashboard = () => {
    const [newChannelName, setNewChannelName] = useState("");
    const [channels, setChannels] = useState([]);
    const [message, setMessage] = useState("");
    const [newChannelMembers, setNewChannelMembers] = useState("");
    const [users, setUsers] = useState([]);

    const [selectedChannel, setSelectedChannel] = useState(null);
    const [channelMessages, setChannelMessages] = useState([]);
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io(HOST, {
            auth: { token: localStorage.getItem("token") },
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [channelsRes, usersRes] = await Promise.all([
                    apiClient.get(CHANNEL_ROUTE),
                    apiClient.get(USER_ROUTE),
                ]);
                setChannels(channelsRes.data);
                setUsers(usersRes.data);

                const savedChannelId = localStorage.getItem("selectedChannelId");
                if (savedChannelId) {
                    const channelFromList = channelsRes.data.find(c => c._id === savedChannelId);
                    if (channelFromList) {
                        const fullChannelRes = await apiClient.get(`${CHANNEL_ROUTE}/${savedChannelId}`);
                        setSelectedChannel(fullChannelRes.data);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch channels or users:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!selectedChannel || !socketRef.current) return;

        const socket = socketRef.current;
        socket.emit("join_channel", selectedChannel._id);

        const fetchMessages = async () => {
            try {
                const res = await apiClient.get(`/api/messages/${selectedChannel._id}`);
                setChannelMessages(res.data);
            } catch (error) {
                console.error("Failed to fetch messages", error);
                setChannelMessages([]);
            }
        };
        fetchMessages();

        socket.on("new_message", (msg) => {
            setChannelMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.emit("leave_channel", selectedChannel._id);
            socket.off("new_message");
        };
    }, [selectedChannel]);

    const createChannel = async () => {
        if (!newChannelName.trim()) return;
        try {
            const userId = localStorage.getItem("userId");
            const membersList = newChannelMembers
                .split(",")
                .map((username) => username.trim())
                .map(username => users.find(u => u.username === username)?._id)
                .filter(Boolean);
            membersList.push(userId);
            const response = await apiClient.post(CHANNEL_ROUTE, {
                name: newChannelName,
                members: membersList,
            });
            setChannels((prev) => [...prev, response.data]);
            setNewChannelName("");
            setNewChannelMembers("");
            setMessage("Channel created");
        } catch (error) {
            setMessage("Failed to create channel");
            console.error("Failed to create channel", error);
        }
    };

    const sendMessage = async (content) => {
        if (!selectedChannel || !content.trim()) return;
        try {
            const res = await apiClient.post(`${MESSAGE_ROUTE}/${selectedChannel._id}`, {
                content,
                channelId: selectedChannel._id,
            });
            setChannelMessages((prev) => [...prev, res.data]);
            socketRef.current.emit("send_message", res.data);
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    const leaveChannel = async (channel) => {
        try {
            await apiClient.delete(`${CHANNEL_ROUTE}/${channel._id}/leave`);

            setChannels((prev) => prev.filter((c) => c._id !== channel._id));

            if (selectedChannel?._id === channel._id) {
                setSelectedChannel(null);
                setChannelMessages([]);
                localStorage.removeItem("selectedChannelId");
            }
        } catch (error) {
            console.error("Failed to leave channel", error);
        }
    };

    return (
        <div className="h-screen flex">
            <div className="w-1/4 flex flex-col bg-red-200">
                <div className="flex p-2 bg-red-500 rounded-md">
                    <div className="h-full w-1/4 flex bg-red-600">
                        <img class="object-scale-down" src="../../../public/extremessage_logo.jpg" />
                    </div>
                    <div className="h-full w-3/4 flex-wrap justify-center items-center bg-red-400 p-2">
                        <p class="text-center font-bold text-lg">Extremessage Dashboard</p>
                        <p class="text-center">You are logged in.</p>
                    </div>
                </div>
                <div className="flex-1 overflow-auto p-2">
                    {/* <ChannelList apiClient={apiClient} channels={channels} onSelectChannel={(channel) => setSelectedChannel(channel)}/> */}
                    <ChannelList
                        apiClient={apiClient}
                        channels={channels}
                        onSelectChannel={(channel) => setSelectedChannel(channel)}
                        onLeaveChannel={leaveChannel} 
                    />
                </div>

                <div className="p-2 mt-auto flex flex-col gap-2 bg-red-300 rounded-t-lg">
                    <input
                        type="text"
                        placeholder="New channel name"
                        value={newChannelName}
                        onChange={(e) => setNewChannelName(e.target.value)}
                        className="rounded-full p-2"
                    />
                    <input
                        type="text"
                        placeholder="Members"
                        value={newChannelMembers}
                        onChange={(e) => setNewChannelMembers(e.target.value)}
                        className="rounded-full p-2"
                    />
                    <button
                        onClick={createChannel}
                        className="rounded-full p-2 bg-red-500 hover:bg-red-600 text-white"
                    >
                        Create Channel
                    </button>
                    {message && (
                        <p className="text-center mt-4 font-semibold">{message}</p>
                    )}
                </div>

            </div>

            <div className="w-1/2 flex flex-col bg-green-200 border-r">
                <div className="flex-2 overflow-auto p-2">
                    <b>{selectedChannel ? `#${selectedChannel.name}` : "Messages"}</b>
                    {selectedChannel ? (
                        channelMessages.map((msg) => (
                        <p key={msg._id}>
                        <strong>{msg.sender.username}:</strong> {msg.content}
                        </p>
                        ))
                    ) : (
                        <p className="italic text-gray-500">Select a channel to view messages</p>
                    )}
                </div>
                <div className="p-2 mt-auto flex flex-col gap-2 bg-green-400 rounded-t-lg">
                    {/* <MessageInput /> */}
                    <MessageInput onSend={sendMessage} />
                </div>
            </div>

            <div className="w-1/4 flex flex-col bg-blue-200">
                <div className="flex-1 overflow-auto p-2">
                    <b>Users</b>
                    {selectedChannel ? (
                        <UserList apiClient={apiClient} users={users} selectedChannel={selectedChannel} />
                    ) : (
                        <p className="italic text-gray-500">Select a channel to see members</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;