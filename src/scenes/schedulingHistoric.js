import React, { useEffect, useState } from "react";
import {
    HStack,
    Container,
    VStack,
    Heading,
    Stack,
    Box,
    Text,
    Avatar,
    Button,
    View,
    FlatList,
    CheckIcon,
    AlertDialog,
    Center,
    ScrollView
} from "native-base";
import Lottie from 'lottie-react-native'
import {
    FontAwesomeIcon,
    faCalendarCheck,
    faClockRotateLeft
} from "./../assets/icons/icons"
import { ActivityIndicator, RefreshControl } from "react-native";
import API_URL from "./components/apiURL";
import AsyncStorage from "@react-native-async-storage/async-storage";


const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}


const SchedulingHistoric = ({ route }) => {
    const [isScheludesEmpty, setIsScheduleEmpty] = useState(false)
    const [acutalPage, setActualPage] = useState(0)
    const [logged, setLogged] = useState('sim')
    const [user, setUser] = useState()
    const [scheduleds, setScheduleds] = useState([])
    const [loading, setLoading] = useState(false)
    const [scrollLoading, setScrollLoading] = useState(false)
    const [updateDOOM, setUpdateDOOM] = useState(false)


    const cancelSchedule = async () => {
        const URL = `${API_URL}/agendamentos/excluir`
        const response = await fetch(URL, {
            method: 'POST',
        });
        const result = await response.json();
        setUpdateDOOM(!updateDOOM)
    }
    const Items = ({ value }) => {
        const [isOpen, setIsOpen] = React.useState(false);
        const [loaginBtn, setLoadingBtn] = useState(false)

        const cancel = async () => {
            setLoadingBtn(true)
            cancelSchedule()
        }

        const onClose = () => setIsOpen(false);
        const cancelRef = React.useRef(null);


        return (
            <>
                {value && (
                    <Box mb={12} backgroundColor="white" >
                        <Center>
                            <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
                                <AlertDialog.Content>
                                    <AlertDialog.CloseButton />
                                    <AlertDialog.Header>Cancelar Agendamento</AlertDialog.Header>
                                    <AlertDialog.Body>
                                        Tem certeza que deseja cancelar esse agendamento? Essa ação é
                                        irreversível
                                    </AlertDialog.Body>
                                    <AlertDialog.Footer>
                                        <Button.Group space={2}>
                                            <Button colorScheme="muted" onPress={onClose} ref={cancelRef}>
                                                Não quero
                                            </Button>
                                            <Button isLoading={loaginBtn} colorScheme="danger" onPress={cancel}>
                                                Cancelar
                                            </Button>
                                        </Button.Group>
                                    </AlertDialog.Footer>
                                </AlertDialog.Content>
                            </AlertDialog>
                        </Center>
                        <VStack space="2.5" mt="4" px="3">
                            <Stack
                                direction="row"
                                mb="2.5"
                                mt="1.5"
                                space={3}

                            >
                                <Box w="65%">
                                    <Heading size="sm" mb="5" ml={3}>
                                        {value.barbeiro}
                                    </Heading>
                                    <View
                                        display="flex"

                                        style={{
                                            flexDirection: 'row',
                                            alignItems: "center"
                                        }}
                                    >
                                        <Lottie
                                            source={require('./../assets/icons/109733-scissor-snip.json')}
                                            autoPlay
                                            loop={false}
                                            style={{
                                                width: 25,
                                                height: 35,
                                            }}
                                        />
                                        <Text color="light.700" ml={3}>

                                            {value.servicos}
                                        </Text>

                                    </View>

                                    {value.status == 'em espera' ? (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            colorScheme="muted"
                                            mt={10}
                                            maxW="65%"
                                            onPress={() => setIsOpen(!isOpen)}
                                        >CANCELAR</Button>
                                    ) : (
                                        <Text mt="10" colorScheme="success">
                                            <CheckIcon color="emerald.500" />{' '}Finalizado
                                        </Text>
                                    )}


                                </Box>

                                <Box w="25%" alignItems="flex-end">
                                    <Avatar bg="primary.300" source={{
                                        uri: value.foto_barbeiro
                                    }} size="lg">  AJ
                                    </Avatar>

                                    <Text
                                        mt="3"
                                        color="muted.600"
                                        fontWeight="bold"
                                    >
                                        {value.hora}
                                        &nbsp;&nbsp;
                                        <FontAwesomeIcon icon={faClockRotateLeft} />
                                    </Text>

                                    <Text

                                        color="muted.600"
                                        fontWeight="bold"
                                        fontSize={15}
                                    >
                                        {value.data}
                                        &nbsp;&nbsp;
                                        <FontAwesomeIcon icon={faCalendarCheck} />
                                    </Text>
                                    <Text
                                        color="muted.600"
                                        fontWeight="bold"
                                        fontSize={11}
                                    >
                                        {value.dia_semana}
                                    </Text>
                                </Box>

                            </Stack>
                        </VStack>
                    </Box>
                )
                }

            </>

        )
    }

    renderFooter = () => {
        if (!scrollLoading) return null;
        return (
            <View
                height={50}
                mb="7"
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
            >
                <ActivityIndicator />
            </View>
        );
    };


    const verifyLogged = async () => {
        const userAsync = await AsyncStorage.getItem('@login')

        if (userAsync) {
            const usuarioJSON = JSON.parse(userAsync)
            setUser(usuarioJSON)
        } else {
            setLogged('nao')
        }
    }

    const isEmptyObject = (obj) => {
        return JSON.stringify(obj) === '{}';
    }

    const loadSchedules = async () => {
        setScrollLoading(true)
        if (logged) {
            const userAsyncHandler = await AsyncStorage.getItem('@login')
            const objectUser = JSON.parse(userAsyncHandler)
            setActualPage(acutalPage + 1)
            const response = await fetch(`${API_URL}/agendamentos?idUsuario=${objectUser.id}&offset=${acutalPage}`);
            const result = await response.json();

            if (result) {
                if (!isEmptyObject(result.agendamentosFinalizados) || !isEmptyObject(result.agendamentosEmEspera)) {
                    let schedulesdsFinnaly = []
                    let haveSchedulesActive = false
                    result.agendamentosFinalizados.map((agendamento) => {
                        let isInArray = false
                        scheduleds.map((schedule) => {
                            if (agendamento.id == schedule.id) {
                                isInArray = true

                            }

                            if (schedule.status == 'em espera') {
                                haveSchedulesActive = true
                            }

                        })

                        if (!isInArray) {
                            schedulesdsFinnaly.push(agendamento)
                        }

                    })

                    if (haveSchedulesActive) {
                        if (result.agendamentosEmEspera) {
                            schedulesdsFinnaly.unshift(result.agendamentosEmEspera[0])
                        }
                    }
                    setScrollLoading(false)
                    setScheduleds([...scheduleds, ...schedulesdsFinnaly])

                } else {
                    console.log('nao entrei')
                }
            }




        }
        setLoading(false)

    }

    const getScheduleds = async () => {
        setIsScheduleEmpty(false)
        setLoading(true)
        if (logged) {
            const userAsyncHandler = await AsyncStorage.getItem('@login')
            const objectUser = JSON.parse(userAsyncHandler)
            const response = await fetch(`${API_URL}/agendamentos?idUsuario=${objectUser.id}&offset=0`);
            const result = await response.json();

            if (result.agendamentosFinalizados.length > 0 || result.agendamentosEmEspera.length > 0) {
                let schedulesdsFinnaly = result.agendamentosFinalizados

                if (result.agendamentosEmEspera) {
                    schedulesdsFinnaly.unshift(result.agendamentosEmEspera[0])
                }
                setScheduleds(schedulesdsFinnaly)
            } else {
                setIsScheduleEmpty(true)
            }
        }
        setLoading(false)
    }

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
        getScheduleds()
    }, []);


    useEffect(() => {
        console.log('hi')
    }, [])

    useEffect(() => {
        verifyLogged()
        getScheduleds()
    }, [route])

    useEffect(() => {
        verifyLogged()
        getScheduleds()
    }, [updateDOOM])

    const renderItem = ({ item }) => (
        <Items value={item} />
    );

    return (
        <View
            style={{ backgroundColor: "#e7e3db", height: '100%' }}
        >

            <HStack
                space={1}
                justifyContent="center"
                backgroundColor="#00adf5"
                p={5}
            >
                <Container>
                    <Heading color="primary.50">
                        Meus Agendamento
                    </Heading>
                </Container>
            </HStack>
            {loading && (
                <ActivityIndicator
                    size={45}
                />
            )}



            {logged == 'sim' ? (
                <>
                    {isScheludesEmpty && (
                        <ScrollView p={4}>


                            <Box mt="5" backgroundColor="white" >

                                <VStack space="2.5" mt="4" px="3">
                                    <Stack
                                        direction="row"
                                        mb="2.5"
                                        mt="1.5"
                                        space={3}

                                    >
                                        <Box w="65%">
                                            <Heading size="sm">
                                                Você ainda não tem nenhum agendamento.
                                            </Heading>
                                            <Text color="light.700" mt="3">
                                                Volte para a tela de agendamentos para realizar o seu
                                                agendamento!
                                            </Text>
                                        </Box>

                                        <Box w="25%">
                                            <Lottie source={require('./../assets/icons/59827-calendar-error.json')} autoPlay loop />
                                        </Box>
                                    </Stack>
                                </VStack>
                            </Box>
                        </ScrollView>
                    )}
                    {!isScheludesEmpty && (
                        <>
                            {scheduleds.length >= 6 ? (
                                <View p={4}>
                                    <FlatList
                                        data={scheduleds}
                                        renderItem={renderItem}
                                        onEndReached={loadSchedules}
                                        ListFooterComponent={renderFooter}
                                    />
                                </View>
                            ) : (
                                <View p={4}>
                                    <FlatList
                                        data={scheduleds}
                                        renderItem={renderItem}
                                        refreshControl={
                                            <RefreshControl
                                                refreshing={refreshing}
                                                onRefresh={onRefresh}
                                            />
                                        }
                                    />
                                </View>
                            )}
                        </>

                    )}

                </>
            ) : (
                <View p={4}>
                    <Box mt="5" backgroundColor="white" >

                        <VStack space="2.5" mt="4" px="3">
                            <Stack
                                direction="row"
                                mb="2.5"
                                mt="1.5"
                                space={3}

                            >
                                <Box w="65%">
                                    <Heading size="sm">
                                        Você não está logado...
                                    </Heading>
                                    <Text color="light.700" mt="3">
                                        Avançe para a tela de login para ver seus agendamentos
                                    </Text>
                                </Box>

                                <Box w="25%">
                                    <Lottie source={require('./../assets/icons/59827-calendar-error.json')} autoPlay loop />
                                </Box>
                            </Stack>
                        </VStack>
                    </Box>
                </View>

            )}

        </View >
    )
}

export default SchedulingHistoric