// import React, { useState, useRef, useEffect } from 'react';
// import { createRoot } from 'react-dom/client';
// import pxtalkSip from './js/pxtalkSip';
// import './styles.css';

// const SIP_ACCOUNT_DETAILS = {
//     name: 'Teste Dev 1',
//     number: '5597449376',
//     password: 'oq0g3cv0qs',
//     domain: 'pxa.pxtalk.com.br',
//     wsServer: 'wss://phone-rtc.pxtalk.com.br:4443/ws'
// };

// const SessionState = {
//     Establishing: 'Establishing',
//     Established: 'Established',
//     Terminated: 'Terminated'
// };

// const App = () => {
//     const [isTemplateVisible, setTemplateVisibility] = useState(false);
//     const [userAgent, setUserAgent] = useState(null);
//     const [invitation, setInvitation] = useState(null);
//     const mediaElement = useRef(null);

//     const toggleTemplateVisibility = () => {
//         setTemplateVisibility(!isTemplateVisible);
//     }

//     const registerSipAccount = async () => {
//         try {
//             const register = await pxtalkSip.registerUserAgent(
//                 SIP_ACCOUNT_DETAILS.name, 
//                 SIP_ACCOUNT_DETAILS.number, 
//                 SIP_ACCOUNT_DETAILS.password, 
//                 SIP_ACCOUNT_DETAILS.domain, 
//                 SIP_ACCOUNT_DETAILS.wsServer
//             )

//             setUserAgent(register.userAgent)

//             register.userAgent.delegate = {
//                 onInvite(invitation) {
//                     console.log('on invite', invitation);
                    
//                     setInvitation(invitation);

//                     invitation.stateChange.addListener((newState) => {
//                         switch (newState) {
//                             case SessionState.Establishing:
//                                 console.log(`Sessão em estado de estabelecimento.`)
//                                 break;
//                             case SessionState.Established:
//                                 console.log(`Sessão estabelecida com sucesso.`)
//                                 break;
//                             case SessionState.Terminated:
//                                 console.log(`Sessão terminada.`)
//                                 break;
//                             default:
//                                 break;
//                         }
//                     });
//                 },
//             }

//         } catch (error) {
//             console.error('Failed to register SIP account', error);
//         }
//     }

//     const acceptCall = () => {
//         pxtalkSip.acceptCall(invitation, mediaElement.current);
//     };
    
//     const makeCall = () => {
//         pxtalkSip.makeCall(userAgent, SIP_ACCOUNT_DETAILS.number, mediaElement.current);
//     };

//     const verifyUserAgent = () => {
//         console.log(userAgent)
//     }

//     return (
//         <div className='px-app-container'>
//             <audio ref={mediaElement} id="mediaElement"></audio>

//             <button className='px-chatbot-button' onClick={() => toggleTemplateVisibility()}>
//                 <svg xmlns="http://www.w3.org/2000/svg" fill='#ffff' id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="512" height="512">
//                     <path d="M24,6.24c0,7.64-10.13,17.76-17.76,17.76-1.67,0-3.23-.63-4.38-1.78l-1-1.15c-1.16-1.16-1.16-3.12,.05-4.33,.03-.03,2.44-1.88,2.44-1.88,1.2-1.14,3.09-1.14,4.28,0l1.46,1.17c3.2-1.36,5.47-3.64,6.93-6.95l-1.16-1.46c-1.15-1.19-1.15-3.09,0-4.28,0,0,1.85-2.41,1.88-2.44,1.21-1.21,3.17-1.21,4.38,0l1.05,.91c1.2,1.19,1.83,2.75,1.83,4.42Z" />
//                 </svg>
//             </button>

//             {isTemplateVisible && (
//                 <div className='px-app-template'>
//                     <div className="chatbot-message">Bem-vindo ao Chatbot!</div>

//                     {  }

//                     <button className='px-sip-register-button' onClick={() => verifyUserAgent()}>
//                         Verificar UserAgent
//                     </button>


//                     <button className='px-sip-register-button' onClick={() => acceptCall()}>
//                         Aceitar chamada
//                     </button>

//                     <button className='px-sip-register-button' onClick={() => registerSipAccount()}>
//                         Registrar Conta SIP
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// }

// const root = createRoot(document.getElementById('card_widget'));
// root.render(<React.StrictMode><App /></React.StrictMode>);

import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import pxtalkSip from './js/pxtalkSip';
import './styles.css';

const SIP_ACCOUNT_DETAILS = {
    name: 'Teste Dev 1',
    number: '5597449376',
    password: 'oq0g3cv0qs',
    domain: 'pxa.pxtalk.com.br',
    wsServer: 'wss://phone-rtc.pxtalk.com.br:4443/ws'
};

const SIP_TARGET_DETAILS = {
    number: '1010',
    domain: 'pxa.pxtalk.com.br',
};

const SessionState = {
    Establishing: 'Establishing',
    Established: 'Established',
    Terminated: 'Terminated'
};

const App = () => {
    const [isTemplateVisible, setTemplateVisibility] = useState(false);
    const [userAgent, setUserAgent] = useState(null);
    const [invitation, setInvitation] = useState(null);
    const [userAgentStatus, setUserAgentStatus] = useState(''); // Adicionado para armazenar o status do userAgent
    const mediaElement = useRef(null);

    const toggleTemplateVisibility = () => {
        setTemplateVisibility(!isTemplateVisible);
    }

    const registerSipAccount = async () => {
        try {
            const register = await pxtalkSip.registerUserAgent(
                SIP_ACCOUNT_DETAILS.name, 
                SIP_ACCOUNT_DETAILS.number, 
                SIP_ACCOUNT_DETAILS.password, 
                SIP_ACCOUNT_DETAILS.domain, 
                SIP_ACCOUNT_DETAILS.wsServer
            )

            setUserAgent(register.userAgent);

            // Atualiza o status inicial
            updateStatus(register.userAgent.state);

            register.userAgent.delegate = {
                onInvite(invitation) {
                    console.log('on invite', invitation);

                    setInvitation(invitation);

                    invitation.stateChange.addListener((newState) => {
                        updateStatus(newState); // Atualiza o status ao mudar de estado
                        switch (newState) {
                            case SessionState.Establishing:
                                console.log(`Sessão em estado de estabelecimento.`);
                                break;
                            case SessionState.Established:
                                console.log(`Sessão estabelecida com sucesso.`);
                                break;
                            case SessionState.Terminated:
                                console.log(`Sessão terminada.`);
                                break;
                            default:
                                break;
                        }
                    });
                },
            }

        } catch (error) {
            console.error('Failed to register SIP account', error);
        }
    }

    const acceptCall = () => {
        pxtalkSip.acceptCall(invitation, mediaElement.current);
    };
    
    const makeCall = () => {
        pxtalkSip.makeCall(userAgent, SIP_TARGET_DETAILS.number, SIP_TARGET_DETAILS.domain, mediaElement.current);
    };

    const verifyUserAgent = () => {
        console.log(userAgent)
    }

    // Método para atualizar o status do userAgent
    const updateStatus = (status) => {
        setUserAgentStatus(status);
    };

    // useEffect para verificar o status do userAgent em intervalos regulares
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (userAgent) {
                updateStatus(userAgent.state);
            }
        }, 5000); // Atualiza a cada 5 segundos

        return () => clearInterval(intervalId); // Limpa o intervalo ao desmontar o componente
    }, [userAgent]);

    return (
        <div className='px-app-container'>
            <audio ref={mediaElement} id="mediaElement"></audio>

            <button className='px-chatbot-button' onClick={() => toggleTemplateVisibility()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill='#ffff' id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="512" height="512">
                    <path d="M24,6.24c0,7.64-10.13,17.76-17.76,17.76-1.67,0-3.23-.63-4.38-1.78l-1-1.15c-1.16-1.16-1.16-3.12,.05-4.33,.03-.03,2.44-1.88,2.44-1.88,1.2-1.14,3.09-1.14,4.28,0l1.46,1.17c3.2-1.36,5.47-3.64,6.93-6.95l-1.16-1.46c-1.15-1.19-1.15-3.09,0-4.28,0,0,1.85-2.41,1.88-2.44,1.21-1.21,3.17-1.21,4.38,0l1.05,.91c1.2,1.19,1.83,2.75,1.83,4.42Z" />
                </svg>
            </button>

            {isTemplateVisible && (
                <div className='px-app-template'>
                    <div className="chatbot-message">Bem-vindo ao Chatbot!</div>

                    <div>Status do UserAgent: {userAgentStatus}</div>

                    <button className='px-sip-register-button' onClick={() => verifyUserAgent()}>
                        Verificar UserAgent
                    </button>

                    <button className='px-sip-register-button' onClick={() => acceptCall()}>
                        Aceitar chamada
                    </button>

                    <button className='px-sip-register-button' onClick={() => makeCall()}>
                        Fazer chamada
                    </button>

                    <button className='px-sip-register-button' onClick={() => registerSipAccount()}>
                        Registrar Conta SIP
                    </button>
                </div>
            )}
        </div>
    );
}

const root = createRoot(document.getElementById('card_widget'));
root.render(<React.StrictMode><App /></React.StrictMode>);
