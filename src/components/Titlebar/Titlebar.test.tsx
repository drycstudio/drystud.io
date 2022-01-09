import React from "react";
import { render } from "@testing-library/react";

import Titlebar from "./Titlebar";

describe("Titlebar", () => {
    test("renders the Titlebar component", () => {
        render(<Titlebar title="Hello world!" />);
    });
});