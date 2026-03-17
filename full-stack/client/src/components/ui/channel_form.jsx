import { useState } from "react";

const ChannelForm = ({ users, onCreateChannel, newChannelName, setNewChannelName, message }) => {
    const [memberSearch, setMemberSearch] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const filteredUsers = users.filter(
        (u) =>
            u.username.toLowerCase().includes(memberSearch.toLowerCase()) &&
            !selectedMembers.find((m) => m._id === u._id)
    );

    const addMember = (user) => {
        setSelectedMembers((prev) => [...prev, user]);
        setMemberSearch("");
        setDropdownOpen(false);
    };

    const removeMember = (userId) => {
        setSelectedMembers((prev) => prev.filter((m) => m._id !== userId));
    };

    const handleCreate = () => {
        onCreateChannel(
            newChannelName,
            selectedMembers.map((m) => m.username).join(",")
        );
        setSelectedMembers([]);
        setMemberSearch("");
    };

    return (
        <div className="p-2 mt-auto flex flex-col gap-2 bg-red-300 rounded-t-lg">
            <input
                type="text"
                placeholder="New channel name"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                className="rounded-full p-2"
            />

            {selectedMembers.length > 0 && (
                <div className="flex flex-wrap gap-1 px-2">
                    {selectedMembers.map((m) => (
                        <span
                            key={m._id}
                            className="bg-red-500 text-white text-sm rounded-full px-3 py-1 flex items-center gap-1"
                        >
                            {m.username}
                            <button
                                onClick={() => removeMember(m._id)}
                                className="hover:text-red-200 font-bold"
                            >
                                x
                            </button>
                        </span>
                    ))}
                </div>
            )}

            <div className="relative">
                <input
                    type="text"
                    placeholder="Search members..."
                    value={memberSearch}
                    onChange={(e) => {
                        setMemberSearch(e.target.value);
                        setDropdownOpen(true);
                    }}
                    onFocus={() => setDropdownOpen(true)}
                    onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                    className="rounded-full p-2 w-full"
                />
                {dropdownOpen && memberSearch && filteredUsers.length > 0 && (
                    <div className="absolute bottom-full mb-1 w-full bg-white border border-red-300 rounded-lg shadow-lg max-h-40 overflow-auto z-10">
                        {filteredUsers.map((user) => (
                            <div
                                key={user._id}
                                onMouseDown={() => addMember(user)} // onMouseDown fires before onBlur
                                className="px-4 py-2 hover:bg-red-100 cursor-pointer text-sm"
                            >
                                {user.username}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                onClick={handleCreate}
                className="rounded-full p-2 bg-red-500 hover:bg-red-600 text-white"
            >
                Create Channel
            </button>
            {message && (
                <p className="text-center mt-4 font-semibold">{message}</p>
            )}
        </div>
    );
};
ChannelForm.displayName = "ChannelForm"

export { ChannelForm };