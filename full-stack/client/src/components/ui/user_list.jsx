import { useEffect } from "react";
import { USER_ROUTE } from "@/lib/constants";

const UserList = ({ apiClient, users = [], selectedChannel }) => {
    const getMemberId = (member) =>
        typeof member === "object" && member !== null ? member._id : member;

    const channelMemberIds = selectedChannel ? selectedChannel.members.map(getMemberId): [];
    const channelUsers = users.filter((user) => channelMemberIds.includes(user._id));

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