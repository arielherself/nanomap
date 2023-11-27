import {Button, IconButton, ButtonGroup, Menu, MenuItem, Stack} from "@mui/joy";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import React from "react";
import {Add, LocationOn} from "@mui/icons-material";

export default function SimulateClick({isLocated,isCandEmpty,relocator}) {
    return (
        <ButtonGroup buttonFlex={1} aria-label="flex button group" sx={{zIndex: 'modal'}}>
            <Button disabled={isLocated} variant={'solid'} color={'warning'} startDecorator={<LocationOn />} onClick={relocator}>Relocate</Button>
            <Button disabled={isCandEmpty} variant={'solid'} color={'primary'} startDecorator={<Add />}>Add</Button>
        </ButtonGroup>
    );
}