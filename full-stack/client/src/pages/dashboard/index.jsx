import axios from "axios";
import { HOST } from "@/lib/constants";
import { MessageInput } from "../../components/ui/message_input.jsx";
import { ChannelList } from "../../components/ui/channel_list.jsx"

// Creates an axios instance with a server URL
const apiClient = axios.create({
  baseURL: HOST,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const Dashboard = () => {
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
                <ChannelList apiClient={apiClient} />
            </div>
        </div>

        <div className="w-1/2 flex flex-col bg-green-200 border-r">
            <div className="flex-2 overflow-auto p-2">
                <b>Messages</b>
                {Array.from({ length: 10000 }, (_, i) => (
                    <p key={i}>Message {i + 1}</p>
                ))}
            </div>
            <div>
                <MessageInput />
            </div>
        </div>

        <div className="w-1/4 flex flex-col bg-blue-200">
            <div className="flex-1 overflow-auto p-2">
                <b>Users</b>
                {Array.from({ length: 1000 }, (_, i) => (
                    <p key={i}>User {i + 1}</p>
                ))}
            </div>
        </div>
    </div>
  );
};

export default Dashboard;