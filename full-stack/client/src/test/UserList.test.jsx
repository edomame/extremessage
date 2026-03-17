import { render, screen } from "@testing-library/react";
import { UserList } from "../components/ui/user_list.jsx";
import { describe, it, expect, vi } from "vitest";

const mockUsers = [
    { _id: "1", username: "alice" },
    { _id: "2", username: "bob" },
    { _id: "3", username: "carol" },
];

describe("UserList", () => {
    it("shows empty state when no members match", () => {
        const channel = { members: [] };
        render(<UserList users={mockUsers} selectedChannel={channel} />);
        expect(screen.getByText("Empty user list")).toBeInTheDocument();
    });

    it("only shows users who are members of the channel", () => {
        const channel = { members: ["1", "3"] };
        render(<UserList users={mockUsers} selectedChannel={channel} />);

        expect(screen.getByText("alice")).toBeInTheDocument();
        expect(screen.getByText("carol")).toBeInTheDocument();
        expect(screen.queryByText("bob")).not.toBeInTheDocument();
    });
});