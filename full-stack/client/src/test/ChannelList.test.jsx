import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChannelList } from "../components/ui/channel_list.jsx";
import { describe, it, expect, vi } from "vitest";

const mockChannels = [
    { _id: "1", name: "general" },
    { _id: "2", name: "random" },
];

describe("ChannelList", () => {
    it("shows empty state when no channels", () => {
        render(<ChannelList channels={[]} onSelectChannel={vi.fn()} onLeaveChannel={vi.fn()} />);
        expect(screen.getByText("Empty chat list")).toBeInTheDocument();
    });

    it("renders channel names", () => {
        render(<ChannelList channels={mockChannels} onSelectChannel={vi.fn()} onLeaveChannel={vi.fn()} />);
        expect(screen.getByText("# general")).toBeInTheDocument();
        expect(screen.getByText("# random")).toBeInTheDocument();
    });

    it("calls onSelectChannel when channel is clicked", async () => {
        const onSelect = vi.fn();
        render(<ChannelList channels={mockChannels} onSelectChannel={onSelect} onLeaveChannel={vi.fn()} />);

        await userEvent.click(screen.getByText("# general"));

        expect(onSelect).toHaveBeenCalledWith(mockChannels[0]);
    });

    it("calls onLeaveChannel when Leave is clicked", async () => {
        const onLeave = vi.fn();
        render(<ChannelList channels={mockChannels} onSelectChannel={vi.fn()} onLeaveChannel={onLeave} />);

        const leaveButtons = screen.getAllByText("Leave");
        await userEvent.click(leaveButtons[0]);

        expect(onLeave).toHaveBeenCalledWith(mockChannels[0]);
    });
});