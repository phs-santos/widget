import { Invitation, InvitationAcceptOptions, InvitationRejectOptions, Inviter, Registerer, RegistererOptions, Session, SessionState, UserAgent, UserAgentOptions } from 'sip.js'
import { handleStateChanges, assignStream } from './sessionMan'

const pxtalkSip = {
    pxtalk: () => {
        console.log('pxtalkSip');
    },

    configUserAgent: (
        displayName,
        authorizationUsername,
        authorizationPassword,
        viaHost,
        serverWs
    ) => {
        const uri = UserAgent.makeURI(`sip:${authorizationUsername}@${viaHost}`)

        const userAgentOptions = {
            displayName,
            authorizationUsername,
            authorizationPassword,
            uri,
            viaHost,
            transportOptions: {
                server: serverWs
            },
            contactName: authorizationUsername,
        }

        const userAgent = new UserAgent(userAgentOptions)

        return {
            message: 'Agente do usuario configurado com sucesso!',
            userAgent
        };
    },

    registerUserAgent: async (
        displayName,
        authorizationUsername,
        authorizationPassword,
        viaHost,
        serverWs
    ) => {
        const uri = UserAgent.makeURI(`sip:${authorizationUsername}@${viaHost}`)

        const userAgentOptions = {
            displayName,
            authorizationUsername,
            authorizationPassword,
            uri,
            viaHost,
            transportOptions: {
                server: serverWs
            },
            contactName: authorizationUsername,
        }

        const userAgent = new UserAgent(userAgentOptions)

        try {
            await userAgent.start()
            const registererOptions = {
                expires: 3600,
            };

            const registerer = new Registerer(userAgent, registererOptions)

            registerer.register()

            console.log('Usuario registrado com sucesso!');
            return {
                message: 'Usuario registrado com sucesso!',
                userAgent
            }
        } catch (error) {
            console.error('O agente do usuário falhou ao iniciar: ', error);
            return {
                message: 'O agente do usuário falhou ao iniciar: ',
                error
            }
        }
    },

    acceptCall: (invitation, mediaElement) => {
        console.log('Current Session State:', invitation.state);

        if (invitation.state !== SessionState.Initial && invitation.state !== SessionState.Establishing) {
            throw new Error("Sessão não está no estado inicial.");
        }

        let constrainsDefault = {
            audio: true,
            video: true,
        };

        handleStateChanges(invitation, undefined, undefined, undefined, mediaElement);

        const options = {
            sessionDescriptionHandlerOptions: {
                constraints: constrainsDefault,
            },
        };

        invitation.accept(options);
    },

    makeCall: (userAgent, number, domain, mediaElement) => {

        const target = UserAgent.makeURI(`sip:${number}@${domain}`);

        if (!target) {
            throw new Error("Failed to create target URI.");
        }

        const inviter = new Inviter(userAgent, target)

        let constrainsDefault = {
            audio: true,
            video: false,
        }

        handleStateChanges(inviter, undefined, undefined, undefined, mediaElement)

        const options = {
            sessionDescriptionHandlerOptions: {
                constraints: constrainsDefault,
            },
        };

        inviter.invite(options)

        inviter.stateChange.addListener((newState) => {
            switch (newState) {
                case SessionState.Establishing:
                    console.log(`Sessão em estado de estabelecimento.`)
                    break;
                case SessionState.Established:
                    console.log(`Sessão estabelecida.`)
                    break;
                case SessionState.Terminated:
                    console.log(`Sessão terminada.`)
                    break;
                default:
            }
        });
    },

};

export default pxtalkSip;

/*


*/