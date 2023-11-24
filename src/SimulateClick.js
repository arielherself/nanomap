import {Button, IconButton, ButtonGroup, Menu, MenuItem, Stack} from "@mui/joy";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import React from "react";

export default function SimulateClick() {
    return (
        <ButtonGroup buttonFlex={1} aria-label="flex button group" sx={{zIndex: 'modal'}}>
            <Button variant={'solid'} color={'success'}>Starting</Button>
            <Button variant={'solid'} color={'primary'}>Destination</Button>
        </ButtonGroup>
    );
}