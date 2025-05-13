"use client"

import { useQRCode } from 'next-qrcode';
import { Users, Copy, QrCode, Check } from 'lucide-react';
import { useState } from 'react';
import MenuBtn from '../components/MenuBtn/MenuBtn';


export default function Lobby() {
    const GamePin = 1234567;
    const { Canvas } = useQRCode();

    const [showQR, setShowQR] = useState(true);
    const [copied, setCopied] = useState(false);

    const copyToClipboard =  () => {
        navigator.clipboard.writeText(joinLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000)
    }

    const names = ["Jordan", "Casey", "Riley", "Jamie", "Morgan", "Quinn", "Avery", "Skyler"];
    const joinLink = "randomLink.com"
    
    return(
        <div className='pt-10'>
            <h1 className="text-3xl font-bold text-center">FakeQuizly Lobby</h1>
            <p className='text-center'>Share the game PIN or QR code with players to join</p>

            <div className='flex flex-row justify-around bg-white m-5 p-5 h-[450px]'>

            <div className='text-[#999EA8] w-[45%] flex flex-col items-center justify-center gap-3.5'>
                <div className="text-center">
                    <p className='text-2xl'>Game PIN</p>
                    <p className=' text-[#0871F7] text-5xl font-bold'>{GamePin}</p>

                </div>

                <div>
                    <p>Share Link</p>
                    <div className='flex flex-row'>
                        <input value={joinLink} readOnly= {true} className='p-1.5 border-1 text-gray-900 outline-none ' ></input>
                        <button onClick={copyToClipboard} className=' cursor-pointer p-1.5 border-1 text-gray-900 outline-none rounded-e-sm transition duration-300 ease-in-out hover:bg-gray-200'>{copied ? <Check className='text-green-300' /> : <Copy />}</button>

                    </div>

                </div>



                <div>
                    <button className='flex flex-row gap-2.5 cursor-pointer p-1.5 border-1 text-gray-900 outline-none rounded-e-sm transition duration-300 ease-in-out hover:bg-gray-200' onClick={() => setShowQR(!showQR)}>Show QR code <QrCode/> </button>
                    {showQR ? "" : 
                        <Canvas
                        className=""
                        text={'https://github.com/bunlong/next-qrcode'}
                        options={{
                            errorCorrectionLevel: 'low',
                            margin: 3,
                            scale: 4,
                            width: 150,
                            color: {
                            dark: '#000000',
                            light: '#FFFFFF',
                            },
                        }}
                    />}
                        
                </div>
            </div>
            
            {/*Player List*/}
            <div className='flex flex-col w-[55%]'>

            <p className='text-gray-900 text-3xl flex flex-row items-center gap-0.5'><Users />Players</p>
            <div className='text-gray-600 overflow-scroll'>
                <ol className='list-decimal'>
                {names.map((player) => {
                    return(                        
                            <li className='rounded-md p-5 transition duration-400 ease-in-out hover:bg-gray-400'>{player}</li>
                        )
                    })}
                </ol>
            </div>

            <MenuBtn className=" ml-auto mr-auto" text="Play Quiz" link="/solo" />

            </div>

            </div>
        </div>
    );
}