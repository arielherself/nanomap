import {Button, IconButton, ButtonGroup, Menu, MenuItem, Stack} from "@mui/joy";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import React from "react";
import {Delete, LocationOn} from "@mui/icons-material";

export default function SimulateClick({isLocated,isMarkersEmpty,relocator,clearMarkers}) {
    return (
        <ButtonGroup buttonFlex={1} aria-label="flex button group" sx={{zIndex: 'modal'}}>
            <Button disabled={isLocated} variant={'solid'} color={'warning'} startDecorator={<LocationOn />} onClick={relocator}>Relocate</Button>
            <Button disabled={isMarkersEmpty} variant={'solid'} color={'danger'} startDecorator={<Delete />} onClick={clearMarkers}>Clear</Button>
        </ButtonGroup>
    );
}