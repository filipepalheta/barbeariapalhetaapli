import {
    View,
    ScrollView,
    Text,
    Icon,
    Input,
    FormControl,
    Pressable,
    Button,
    WarningOutlineIcon
} from "native-base";
import React, { useEffect, useState, useRef } from "react";
import { Dimensions, ImageBackground } from "react-native";
import {
    backgroundImage,
    faAngleLeft,
    faEye,
    faEyeSlash,
    FontAwesomeIcon,
} from "../assets/icons/icons";
import loginStyles from "../styles/LoginStyle.js";
import API_URL from "./components/apiURL";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfileScene from "./ProfileScene";
import { Modalize } from "react-native-modalize";
import IntlPhoneInput from 'react-native-intl-phone-input';

const Login = () => {
    const [show, setShow] = useState(false)
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [error, setError] = useState(false),
        [errorMsg, setErrorMsg] = useState(''),
        [errorMsgRegister, setErrorMsgRegister] = useState(''),
        [errorPasswords, setErrorPasswords] = useState(false)
    const [loading, setLoading] = useState(false)

    const [logged, setLogged] = useState(false)

    //Register steps
    const [steps, setSteps] = useState(0),
        [currentViewStep, setCurrentViewStep] = useState(<></>),
        [errorEmail, setErrorEmail] = useState(false),
        [errorEmailMsg, setErrorEmailMsg] = useState(''),
        [errorDados, setErrorDados] = useState(false),
        [errorDadosMsg, setErrorDadosMsg] = useState('')


    //Register data
    const [registerName, setRegisterName] = useState(''),
        [registerEmail, setRegisterEmail] = useState(''),
        [registerPass, setRegisterPass] = useState(''),
        [registerConfirmPass, setRegisterConfirmPass] = useState(''),
        [registerCell, setRegisterCell] = useState(''),
        [cadastrar, setCadastrar] = useState('')


    const [showRegisterPass, setShowRegisterPass] = useState(false),
        [showRegisterPassConfirm, setShowRegisterPassConfirm] = useState(false)

    const registrar = async () => {
        setErrorDados(false)
        setErrorDadosMsg('')
        setErrorEmail(false)
        setErrorEmailMsg('')


        const URL = `${API_URL}/cadastrar`
        setLoading(true)
        setCadastrar('tentativa')
        var dados = {
            nome: registerName,
            email: registerEmail,
            pass: registerPass,
            cell: registerCell.phoneNumber
        }

        if (registerConfirmPass === registerPass) {
            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados) // body data type must match "Content-Type" header
            });
            const res = await response.json(); // parses JSON response into native JavaScript objects
            if (res.success == false) {

                if (res.msg == 'O E-mail já existe, tente um diferente.') {
                    setErrorEmail(true)
                    setErrorEmailMsg(res.msg)
                    
                    setSteps(0)
                    setLoading(false)
                    setCadastrar('erro email')
                } else {
                    setErrorDados(true)
                    setErrorDadosMsg(res.msg)
                    setLoading(false)
                    setCadastrar('erro dados')
                }
            }else{
                await AsyncStorage.setItem('@login', JSON.stringify(res.user))
                modalizeRef.current?.close();
                setCadastrar('sucesso')
            }

        } else {
            setErrorPasswords(true)
            setCadastrar('erro')
            setErrorMsgRegister('Os campos precisam ser iguais')
            setLoading(false)
        }
    }

    const changeViewStep = () => {
        switch (steps) {
            case 0:

                setCurrentViewStep(
                    <>
                        <View style={{
                            padding: 40
                        }}>
                            <Text color="muted.900" style={{ fontSize: 21, fontWeight: 'bold' }}>
                                Primeiro, precisamos do seu nome e o seu e-mail
                            </Text>

                            <View style={{ marginTop: 35 }}>
                                <FormControl>
                                    <FormControl.Label floatingLabel>Primeiro e último nome</FormControl.Label>
                                    <Input
                                        isRequired
                                        value={registerName}
                                        keyboardType="default"
                                        onChangeText={e => setRegisterName(e)}
                                        variant="underlined"
                                        size="2xl"
                                    />
                                </FormControl>

                                <FormControl isInvalid={errorEmail}>
                                    <FormControl.Label floatingLabel>Email</FormControl.Label>
                                    <Input
                                        isRequired
                                        value={registerEmail}
                                        keyboardType="email-adress"
                                        onChangeText={e => setRegisterEmail(e)}
                                        variant="underlined"
                                        size="2xl"
                                    />
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        {errorEmailMsg}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                            </View>
                            <View style={loginStyles.forgotPassView}>

                            </View>

                            <View style={{
                                height: 100,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Button isLoading={loading} colorScheme="success" onPress={() => setSteps(1)} style={loginStyles.registerStepButton}>
                                    <Text color="white">Próximo</Text>
                                </Button>
                            </View>
                        </View>

                    </>
                )
                break
            case 1:
                setCurrentViewStep(
                    <>
                        <View style={{
                            padding: 40
                        }}>
                            <Text color="muted.900" style={{ fontSize: 21, fontWeight: 'bold' }}>
                                Agora, digite o número do seu celular com o seu DDD
                            </Text>

                            <View style={{ marginTop: 35 }}>
                                <FormControl>
                                    <FormControl.Label floatingLabel>Celular</FormControl.Label>
                                    {/* <Input
                                        isRequired
                                        value={registerCell}
                                        onChangeText={e => setRegisterCell(e)}
                                        variant="underlined"
                                        size="2xl"
                                    /> */}
                                    <IntlPhoneInput
                                        onChangeText={e => setRegisterCell(e)}
                                        defaultCountry="BR"
                                        
                                        phoneInputStyle={{
                                            color: 'black',
                                            borderColor: 'black',
                                            borderBottomWidth: 1,
                                            fontSize: 20
                                        }}
                                    />

                                </FormControl>


                            </View>
                            <View style={loginStyles.forgotPassView}>

                            </View>

                            <View style={{
                                height: 100,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Button
                                    isLoading={loading}
                                    colorScheme="muted"
                                    onPress={() => setSteps(0)}
                                    style={[loginStyles.registerStepButton, {
                                        width: 50
                                    }]}

                                >
                                    <Text color="white">
                                        <FontAwesomeIcon icon={faAngleLeft} color="white" />
                                    </Text>
                                </Button>
                                <Button isLoading={loading} colorScheme="success" onPress={() => setSteps(2)} style={loginStyles.registerStepButton}>
                                    <Text color="white">Próximo</Text>
                                </Button>
                            </View>
                        </View>

                    </>
                )

                break
            case 2:
                setCurrentViewStep(
                    <>
                        <View style={{
                            padding: 40
                        }}>
                            <Text color={errorDadosMsg ? 'error.600' : 'muted.900'} style={{ fontSize: 21, fontWeight: 'bold' }}>
                                {errorMsg ? 'Ocorreu um erro ao cadastrar, reveja os dados e tente novamente.' : 'Para finalizar, crie uma senha forte e salve em um bom lugar'}
                            </Text>

                            <View style={{ marginTop: 35 }}>
                                <FormControl isInvalid={errorPasswords}>
                                    <FormControl.Label floatingLabel>Senha</FormControl.Label>
                                    <Input isRequired
                                        type={showRegisterPass ? "text" : "password"}
                                        value={registerPass}
                                        size="2xl"
                                        InputRightElement={
                                            <Pressable onPress={() => setShowRegisterPass(!showRegisterPass)}>
                                                <Icon
                                                    as={
                                                        <FontAwesomeIcon icon={showRegisterPass ? faEye : faEyeSlash} />
                                                    }
                                                    size={5}
                                                    style={{
                                                        marginLeft: 2,
                                                        color: '#a3a3a3'
                                                    }}
                                                />
                                            </Pressable>
                                        }
                                        onChangeText={e => setRegisterPass(e)}
                                        variant="underlined"
                                    />
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        {errorMsgRegister}
                                    </FormControl.ErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={errorPasswords}>
                                    <FormControl.Label
                                        floatingLabel>Confirmar Senha</FormControl.Label>
                                    <Input isRequired
                                        size="2xl"
                                        type={showRegisterPassConfirm ? "text" : "password"}
                                        value={registerConfirmPass}
                                        InputRightElement={
                                            <Pressable onPress={() => setShowRegisterPassConfirm(!showRegisterPassConfirm)}>
                                                <Icon
                                                    as={
                                                        <FontAwesomeIcon icon={showRegisterPassConfirm ? faEye : faEyeSlash} />
                                                    }
                                                    size={5}
                                                    style={{
                                                        marginLeft: 2,
                                                        color: '#a3a3a3'
                                                    }}
                                                />
                                            </Pressable>
                                        }
                                        onChangeText={e => setRegisterConfirmPass(e)}
                                        variant="underlined"
                                    />
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        {errorMsgRegister}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                            </View>
                            <View style={loginStyles.forgotPassView}>

                            </View>

                            <View style={{
                                height: 100,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Button
                                    colorScheme="muted"
                                    onPress={() => setSteps(1)}
                                    style={[loginStyles.registerStepButton, {
                                        width: 50
                                    }]}

                                >
                                    <Text color="white">
                                        <FontAwesomeIcon icon={faAngleLeft} color="white" />
                                    </Text>
                                </Button>
                                <Button isLoading={loading} colorScheme="success" onPress={() => registrar()} style={loginStyles.registerStepButton}>
                                    <Text color="white">Cadastrar</Text>
                                </Button>
                            </View>
                        </View>

                    </>
                )
                break

        }
    }

    useEffect(() => {
        changeViewStep()
    }, [
        steps,
        registerCell,
        registerConfirmPass,
        registerName,
        registerPass,
        registerEmail,
        showRegisterPassConfirm,
        showRegisterPass,
        errorPasswords,
        cadastrar
    ])

    const login = async (email, pass) => {
        setLoading(true)
        const data = {
            email,
            pass
        }
        const URL = `${API_URL}/login`
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        const res = await response.json(); // parses JSON response into native JavaScript objects
        if (res.success == true) {
            
            await AsyncStorage.setItem('@login', JSON.stringify(res.user))
            setLogged(true)
            return <ProfileScene />
        } else {
            setError(true)
            setErrorMsg(res.message)
        }
        setLoading(false)
    }

    const getUser = async () => {
        const user = await AsyncStorage.getItem('@login')

        if (user) {
            setLogged(true)
        }
    }

    const modalizeRef = useRef(null)

    const signin = () => {
        modalizeRef.current?.open();
    }
    useEffect(() => {
        getUser()
    }, [cadastrar])

    return (
        <>
            {!logged ? (<ScrollView style={{
                flex: 1,
                backgroundColor: '#ffffff',
                maxHeight: Dimensions.get('window').height
            }}>
                <Modalize
                    ref={modalizeRef}
                    snapPoint={700}
                    modalHeight={700}
                    closeOnOverlayTap={true}
                >
                    {currentViewStep}


                </Modalize>
                <ImageBackground source={backgroundImage}
                    style={{ height: Dimensions.get('window').height / 2.5 }}
                >
                    <View style={loginStyles.brandView} />
                </ImageBackground>
                <View style={loginStyles.bottomView}>
                    <View style={{ padding: 40 }}>
                        <Text color={error ? 'error.600' : 'muted.900'} style={{ fontSize: 21, fontWeight: 'bold' }}>
                            {error ? errorMsg : 'Bem vindo! Entre na sua conta para continuar'}
                        </Text>
                        <Text style={{ color: '#525252' }}>
                            Não tem uma conta? {' '}
                            <Text
                                onPress={signin}
                                style={{
                                    color: '#15803d',
                                    fontStyle: 'italic',
                                }}
                            >
                                Cadastrar
                            </Text>
                        </Text>

                        <View style={{ marginTop: 35 }}>
                            <FormControl>
                                <FormControl.Label floatingLabel>Email</FormControl.Label>
                                <Input isRequired value={email} keyboardType="email-adress" onChangeText={e => setEmail(e)} variant="underlined" />
                            </FormControl>
                            <FormControl mt="2">
                                <FormControl.Label floatingLabel>Senha</FormControl.Label>
                                <Input isRequired
                                    type={show ? "text" : "password"}
                                    InputRightElement={
                                        <Pressable onPress={() => setShow(!show)}>
                                            <Icon
                                                as={
                                                    <FontAwesomeIcon icon={show ? faEye : faEyeSlash} />
                                                }
                                                size={5}
                                                style={{
                                                    marginLeft: 2,
                                                    color: '#a3a3a3'
                                                }}
                                            />
                                        </Pressable>
                                    }
                                    onChangeText={e => setPass(e)}
                                    variant="underlined"
                                />
                            </FormControl>
                        </View>
                        <View style={loginStyles.forgotPassView}>
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={{
                                        color: '#8f9195',
                                        alignSelf: 'flex-start',
                                    }}
                                >Esqueci a senha</Text>
                            </View>
                        </View>

                        <View style={{
                            height: 100,
                            justifyContent: 'flex-start',
                            alignItems: 'center'
                        }}>
                            <Button isLoading={loading} colorScheme="success" onPress={() => login(email, pass)} style={loginStyles.loginButton}>
                                <Text color="white">Entrar</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </ScrollView>) : (<ProfileScene />)}

        </>

    )


}

export default Login