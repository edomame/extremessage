import { useEffect, useState } from "react";
import { CHANNEL_ROUTE } from "@/lib/constants";

// const ChannelList = ({ onSelectChannel }) => {
const ChannelList = ({ apiClient, channels = [], onSelectChannel, onLeaveChannel }) => {
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
                <div key={channel._id} className="flex items-center justify-between">
                    <button
                        onClick={() => onSelectChannel(channel)}
                        className="flex-1 text-left p-2 rounded-lg hover:bg-red-300"
                    >
                        # {channel.name}
                    </button>
                    <button
                        onClick={() => onLeaveChannel(channel)}
                        className="text-sm text-red-600 hover:text-red-800 px-2"
                    >
                        Leave
                    </button>
                </div>
            ))
        )}
    </div>
    );
};
ChannelList.displayName = "ChannelList"

export { ChannelList }