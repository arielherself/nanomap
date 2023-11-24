import {Button, IconButton, ButtonGroup, Menu, MenuItem, Stack} from "@mui/joy";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import React from "react";
import {Add} from "@mui/icons-material";

export default function SimulateClick({isCandEmpty}) {
    return (
        <ButtonGroup buttonFlex={1} aria-label="flex button group" sx={{zIndex: 'modal'}}>
            <Button disabled={isCandEmpty} variant={'solid'} color={'primary'} startDecorator={<Add />}>Add</Button>
        </ButtonGroup>
    );
}