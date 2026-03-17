import { useEffect } from "react";
import { USER_ROUTE } from "@/lib/constants";

const UserList = ({ apiClient, users = [], selectedChannel }) => {
    const channelUsers = selectedChannel ? users.filter((user) => selectedChannel.members.includes(user._id)) : [];

    // useEffect(() => {
    //     if (!selectedChannel) return;
    //     const fetchUsers = async () => {
    //         try {
    //             const response = await apiClient.get(USER_ROUTE);
    //             setUsers(response.data);
    //         } catch (error) {
    //             console.error("Failed to fetch users", error);
    //             setUsers([]);
    //         }
    //     };
    //     fetchUsers();
    // }, [apiClient, selectedChannel]);

    return (
    <div className="flex flex-col gap-2">
        {channelUsers.length === 0 ? (
        <p className="text-black-400 italic text-center mt-2">
            Empty user list
        </p>
        ) : (
        <div className="flex flex-wrap gap-2">
            {channelUsers.map((user) => (
                <div
                    key={user._id}
                    className="bg-blue-300 text-white rounded-full px-4 py-2"
                >
                    {user.username}
                </div>
            ))}
        </div>
        )}
    </div>
    );
};
UserList.displayName = "UserList"

export { UserList }