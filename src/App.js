import React, {Component, useState} from 'react';
import {Transition} from 'react-transition-group';
import './App.css';
import UMap from "./UMap";
import {
    Alert,
    Box, Button,
    CircularProgress,
    DialogContent,
    DialogTitle,
    Modal, ModalClose,
    ModalDialog,
    Sheet,
    Typography
} from "@mui/joy";
import {WebhookOutlined} from "@mui/icons-material";
import {post} from "./Networking";

export default function App() {
    const [featureOpen, setFeatureOpen] = useState(true);
    const [version, setVersion] = useState('');
    const [intro, setIntro] = useState('');
    const hs = setInterval(() => {
        post('GET','handshake', []).then((response) => {
            const {version, intro} = response;
            setVersion(version);
            setIntro(intro);
            clearInterval(hs);
        }).catch((e) => {
            console.error(e);
            setVersion('');
        });
    }, 2000);
    return (
        <div className="App" style={{pointerEvents: version !== '' ? 'all' : 'none'}}>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <UMap/>
                <Transition in={featureOpen} timeout={400}>
                    {(state) => (
                        <Modal style={{pointerEvents: version !== '' ? 'all' : 'none'}}
                               keepMounted
                               open={!['exited', 'exiting'].includes(state)}
                               onClose={() => setFeatureOpen(false)}
                               slotProps={{
                                   backdrop: {
                                       sx: {
                                           opacity: 0,
                                           backdropFilter: 'none',
                                           transition: `opacity 400ms, backdrop-filter 400ms`,
                                           ...{
                                               entering: {opacity: 1, backdropFilter: 'blur(8px)'},
                                               entered: {opacity: 1, backdropFilter: 'blur(8px)'},
                                           }[state],
                                       },
                                   },
                               }}
                               sx={{
                                   visibility: state === 'exited' ? 'hidden' : 'visible',
                                   zIndex: 'tooltip'
                               }}
                        >
                            <ModalDialog
                                sx={{
                                    opacity: 0,
                                    transition: `opacity 300ms`,
                                    ...{
                                        entering: {opacity: 1},
                                        entered: {opacity: 1},
                                    }[state],
                                    display: 'flex',
                                    width: version !== '' ? '60%' : 'auto',
                                    height: version !== '' ? '60%' : 'auto',
                                    maxWidth: '50vw',
                                }}
                            >
                                <Sheet sx={{display: 'flex',marginTop: version!==''?'10%':0, flexDirection: 'column'}}>
                                    <Alert style={{display: version !== '' ? 'none' : 'flex'}}
                                           variant="soft"
                                           color="warning"
                                           invertedColors
                                           startDecorator={
                                               <CircularProgress size="lg" color="warning">
                                                   <WebhookOutlined/>
                                               </CircularProgress>
                                           }
                                           sx={{alignItems: 'flex-start', gap: '1rem'}}
                                    >
                                        <Box sx={{flex: 1}}>
                                            <Typography level="title-lg">Still connecting...</Typography>
                                            <Typography level="body-md">
                                                nanoMap requires a valid backend to work. If it takes too long, please
                                                check
                                                your connection or see our status page.
                                            </Typography>
                                        </Box>
                                    </Alert>
                                    <Sheet style={{display: version !== '' ? 'flex' : 'none'}}>
                                        <img src={'icon.jpeg'}
                                             style={{
                                                 height: '150px',
                                                 display: 'flex',
                                                 margin: 'auto',
                                                 borderRadius: '50%'
                                             }}
                                             alt={'nanoMap'}/>
                                    </Sheet>
                                    <DialogTitle style={{display: version !== '' ? 'flex' : 'none'}}
                                                 sx={{margin: 'auto', fontSize: '200%', textAlign: 'center'}}>What's new
                                        in
                                        nanoMap {version}</DialogTitle>
                                    <DialogContent style={{display: version !== '' ? 'flex' : 'none'}}
                                                   sx={{margin: 'auto'}}>
                                        <div dangerouslySetInnerHTML={{__html: intro}}/>
                                    </DialogContent>
                                </Sheet>
                                <Sheet onClick={()=>setFeatureOpen(false)} sx={{display: version!==''?'flex':'none', position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)', width: '100%'}}>
                                    <Button size="lg" sx={{width: '50%', maxWidth: '20vw', display: 'flex', margin: 'auto'}}>Done</Button>
                                </Sheet>
                            </ModalDialog>
                        </Modal>
                    )}
                </Transition>
            </div>
        </div>
    );
}
