import React, { useEffect, useState } from "react";
import {
    Text,
    View,
    HStack,
    Container,
    Heading,
    ScrollView,
    Avatar,
    Image,
    Center,
} from "native-base";
import { TouchableOpacity } from "react-native";
import {
    faAngleRight,
    faSignOut,
    FontAwesomeIcon,
    profilePic
} from "../assets/icons/icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Login from "./login";


const ProfileScene = () => {
    const [dados, setDados] = useState({})
    const [signout, setSignout] = useState('')
    const [logged, setLogged] = useState(true)

    const logout = async () => {
        await AsyncStorage.removeItem('@login')
        setSignout('saiu')
        return <Login />
    }

    const getDados = async () => {
        const usuario = await AsyncStorage.getItem('@login')
        if (usuario) {
            setDados(JSON.parse(usuario))

        } else {
            setLogged(false)
            return <Login />
        }

    }

    useEffect(() => {
        getDados()
    }, [signout])

    return (
        <>
            {logged ? (
                <View style={{ backgroundColor: "#e7e3db", height: '100%' }}>
                    <HStack
                        space={1}
                        justifyContent="center"
                        backgroundColor="#00adf5"
                        p={5}
                    >
                        <Container>
                            <Heading color="primary.50">
                                Meu perfil
                            </Heading>
                        </Container>
                    </HStack>
                    <ScrollView>
                        <View
                            flexDir="row"
                            alignItems="center"
                            justifyContent="flex-start"
                            p={8}
                        >
                            <Avatar alignSelf="center" bg="amber.500" size="lg" source={profilePic} />
                            <View ml={5}>
                                <Heading size="sm">{dados.name}</Heading>
                            </View>

                        </View>

                        <View>
                            <TouchableOpacity

                                onPress={logout}
                                style={{
                                    backgroundColor: 'white',
                                    height: 70,
                                    borderWidth: 2,
                                    borderColor: '#e5e5e5'
                                }}
                            >
                                <View height="100%" flexDir="row">
                                    <View
                                        flexDir="row"
                                        height="100%"
                                        justifyContent="flex-start"
                                        alignItems="center"
                                        pl={8}
                                        w="50%"
                                    >
                                        <FontAwesomeIcon icon={faSignOut} size={30} />
                                        <Text
                                            color="muted.500"
                                            style={{
                                                marginLeft: 10,
                                                fontSize: 19
                                            }}
                                        >
                                            Sair
                                        </Text>
                                    </View>
                                    <View
                                        flexDir="row"
                                        height="100%"
                                        justifyContent="flex-end"
                                        alignItems="center"
                                        pr={8}
                                        w="50%"

                                    >

                                        <FontAwesomeIcon icon={faAngleRight} />
                                    </View>


                                </View>


                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </View>
            ) : (<Login/>)}
        </>


    )
}

export default ProfileScene
