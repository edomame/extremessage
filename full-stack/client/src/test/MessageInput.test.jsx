import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MessageInput } from "../components/ui/message_input.jsx";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

describe("MessageInput", () => {
    it("renders input and send button", () => {
        render(<MessageInput onSend={vi.fn()} />);
        expect(screen.getByPlaceholderText("Message")).toBeInTheDocument();
        expect(screen.getByText("Send")).toBeInTheDocument();
    });

    it("calls onSend with message content when Send is clicked", async () => {
        const onSend = vi.fn();
        render(<MessageInput onSend={onSend} />);

        await userEvent.type(screen.getByPlaceholderText("Message"), "Hello world");
        await userEvent.click(screen.getByText("Send"));

        expect(onSend).toHaveBeenCalledWith("Hello world");
    });

    it("clears input after sending", async () => {
        render(<MessageInput onSend={vi.fn()} />);
        const input = screen.getByPlaceholderText("Message");

        await userEvent.type(input, "Hello");
        await userEvent.click(screen.getByText("Send"));

        expect(input.value).toBe("");
    });

    it("does not call onSend when input is empty", async () => {
        const onSend = vi.fn();
        render(<MessageInput onSend={onSend} />);

        await userEvent.click(screen.getByText("Send"));

        expect(onSend).not.toHaveBeenCalled();
    });

    it("sends message on Enter key", async () => {
        const onSend = vi.fn();
        render(<MessageInput onSend={onSend} />);

        await userEvent.type(screen.getByPlaceholderText("Message"), "Hello{Enter}");

        expect(onSend).toHaveBeenCalledWith("Hello");
    });

    it("shows character count", async () => {
        render(<MessageInput onSend={vi.fn()} />);
        await userEvent.type(screen.getByPlaceholderText("Message"), "Hi");
        expect(screen.getByText("2 / 1000 characters")).toBeInTheDocument();
    });

    it("shows red counter and blocks send over 1000 chars", async () => {
        const onSend = vi.fn();
        render(<MessageInput onSend={onSend} />);

        const input = screen.getByPlaceholderText("Message");
        const longMessage = "a".repeat(1001);

        fireEvent.change(input, { target: { value: longMessage } });

        await userEvent.click(screen.getByText("Send"));

        expect(onSend).not.toHaveBeenCalled();
        expect(screen.getByText("1001 / 1000 characters")).toHaveClass("text-red-500");
    });
});