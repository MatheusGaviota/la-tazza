"use client";

import Button from "./Button";

export default function Navbar() {

    return (
        <header className="w-full border-b">
            <div className="bg-accent h-7">

            </div>
            <div className="bg-foreground h-15 flex items-center justify-center">
                <div className="flex items-center w-full max-w-350">
                    <Button text="Login" href="/login" variant="accent" className="text-xl px-9" />
                </div>
            </div>
        </header>
    );
}
