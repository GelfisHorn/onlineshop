import { useEffect } from "react";

export default function useClickOutside(ref, fn) {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref?.current && !ref.current.contains(event.target)) {
                fn();
            }
        }
        // Bind the event listener
        document.addEventListener("touchend", handleClickOutside)
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchend", handleClickOutside);
        };
    }, [ref]);
}