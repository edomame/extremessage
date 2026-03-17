import { useEffect, useState } from "react";
import { CHANNEL_ROUTE } from "@/lib/constants";

// const ChannelList = ({ onSelectChannel }) => {
const ChannelList = ({ apiClient, channels = [], onSelectChannel }) => {
//   const [channels, setChannels] = useState([]);

//   useEffect is instead called in dashboard so that it can refresh when a new channel is added
//   useEffect(() => {
//     const fetchChannels = async () => {
//       try {
//         const response = await apiClient.get(
//             CHANNEL_ROUTE, 
//             // { withCredentials: true }
//         );
//         setChannels(response.data);
//       } catch (error) {
//         console.error("Failed to fetch channels", error);
//       }
//     };
//     fetchChannels();
//     }, [apiClient]);

    // Testing the buttons without backend connection fully complete
    // const dummyChannels = Array.from({ length: 100 }, (_, i) => ({
    //     _id: String(i + 1),
    //     name: `channel-${i + 1}`,
    // }));
    // setChannels(dummyChannels);
    // }, []);

    return (
    <div className="flex flex-col gap-2">
        {channels.length === 0 ? (
        <p className="text-black-400 italic text-center mt-2">
            Empty chat list
        </p>
        ) : (
        channels.map((channel) => (
            <button
            key={channel._id}
            className="text-left bg-red-300 hover:bg-red-400 rounded p-2"
            onClick={() => onSelectChannel?.(channel)}
            >
            #{channel.name}
            </button>
        ))
        )}
    </div>
    );
};
ChannelList.displayName = "ChannelList"

export { ChannelList }