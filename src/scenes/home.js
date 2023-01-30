import React, {
    useEffect,
    useRef,
    useState,
    Fragment,
    useCallback,
    useMemo
} from "react";

import {
    View,
    Text,
    Center,
    Container,
    Heading,
    Image,
    Box,
    Avatar,
    Button,
    ScrollView,
    WarningIcon,
    Alert,
    VStack,
    HStack,
    CloseIcon,
    IconButton
} from 'native-base';
import { flexes } from "../styles/styles";
import logo from "./../assets/img/logo.png"
import { TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import {
    FontAwesomeIcon,
    faAngleRight,
    scissors,
    barber,
    schedule,
    faCheck,
    barberNoPreferencies,
    calendarHeaderBarber
} from "./../assets/icons/icons"
import { Modalize } from 'react-native-modalize'
import ReactNativeItemSelect from 'react-native-item-select';
import { LocaleConfig } from 'react-native-calendars';
import { Calendar, CalendarUtils } from 'react-native-calendars';
import iDS from "./components/iDS";
import API_URL from "./components/apiURL";
import numeral from "numeral";
import moment from "moment/moment";
import Lottie from 'lottie-react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";

LocaleConfig.locales['br'] = {
    monthNames: [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outobro',
        'Novembro',
        'Dezembro'
    ],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abril', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    today: "Sábado"
};
LocaleConfig.defaultLocale = 'br';

const dayISO = moment(new Date())

const todayEnUS = dayISO.format('YYYY-MM-DD')
const todayPtBR = dayISO.format('DD-MM-YYYY')

function HomeScreen({ navigation }) {
    const [modal, setModal] = useState(<Text></Text>),
        [buttonModal, setButtonModal] = useState(<Button colorScheme="muted" ml="6" onTouchEnd={closeModal} mr="6">FECHAR</Button>)
    const [snapPoint, setSnapPoint] = useState(300),
        [heightContentModal, setHeightContentModal] = useState(350)

    //Schedules views
    const [valueService, setValueService] = useState(0),
        [barberServices, setServices] = useState([]),
        [barbers, setBarbers] = useState([])
    const [calendarState, setCalendarState] = useState(),
        [datesOccuped, setDatesOccuped] = useState([]),
        [datesFree, setDatesFree] = useState([]),
        [datesFreeObj, setDatesFreeObj] = useState([]),
        [barberSelectedSettings, setBarberSelectedSettings] = useState([]),
        [servicesName, setServicesName] = useState([]),
        [hours, setHours] = useState([]),
        [loaderBtn, setLoaderBtn] = useState(false),
        [errorSchedule, setErrorSchedule] = useState(false),
        [errorMsgSchedule, setErrorMsgSchedule] = useState('')

    const [selected, setSelected] = useState(todayEnUS);
    const [currentMonth, setCurrentMonth] = useState(todayEnUS);

    const [hourColor, setHourColor] = useState({})

    // Schedule settings
    const [selectedServices, setSelectedServices] = useState([]),
        [barberSelected, setBarberSelected] = useState(),
        [dateSelected, setDateSelected] = useState(''),
        [hourSelected, setHourSelected] = useState('')

    //Loaders
    const [loading, setLoading] = useState(true)
    const [loader, setLoader] = useState(false)
    const [calendarLoader, setCalendarLoader] = useState(false)

    const selectDate = (id, h) => {
        setHourSelected(h)
        setHourColor((prevState) => ({
            hourColor,
            [id]: !prevState[id]
        }))
    }


    const onDayPress = useCallback((day) => {
        setCalendarLoader(true)
        setSelected(day.dateString);
        setDateSelected(day.dateString)

    }, []);

    const addSelectedService = (item) => {
        var servicesIDS = [],
            servicesNames = ''

        item.map((srv) => {
            servicesIDS.push(srv.id)
            servicesNames += srv.servico_nome + ' '
        })

        if (servicesNames.length > 15) {
            let tamanhoString = servicesNames.substring(0, 13)
            tamanhoString += '...'
            setServicesName(tamanhoString)
        } else {
            setServicesName(servicesNames)
        }
        setSelectedServices(servicesIDS)

        modalizeRef.current?.close();
    }

    const marked = useMemo(() => {
        var obj = { ...datesFreeObj }
        var i = -1

        Object.keys(obj).forEach((key, index) => {
            if (selected == key) {
                i = index
            }
        })

        if (i !== -1) {
            var chave = Object.keys(obj)
            delete obj[chave[i]]
            setDatesFree(obj)
        }

        barberSelectedSettings.map((item) => {
            if (item.date == selected) {
                setHours(item.hours)
            }
        })

        setCalendarLoader(false)
        return {
            [selected]: {
                selected: true,
                dotColor: 'black',
                disableTouchEvent: true,
                selectedColor: 'orange',

            }
        };
    }, [selected, barberSelectedSettings]);

    const modalizeRef = useRef(null)
    const modalCalendar = useRef(null)

    useEffect(() => {
        setCalendarState(
            <Fragment>
                <View>
                    <View
                        style={flexes.headerCalendarStyle}
                    >
                        <View height='100%' display="flex" flexDirection="row">
                            <View style={flexes.buttonRightImageStyle}>
                                <Image source={scissors} height={8} width={8} alt="Scissors" />
                            </View>
                            <View width='10%' />
                            <View width='40%' style={flexes.justifyContentCenter}>
                                <Text color="#6a7182" fontSize={15}>Serviço</Text>
                                <Text color="#6a7182" fontSize={12}>{servicesName}</Text>
                            </View>
                        </View>

                    </View>
                    <View
                        style={flexes.headerCalendarStyle}
                    >
                        <View height='100%' display="flex" flexDirection="row">
                            <View style={flexes.buttonRightImageStyle}>
                                <Image source={calendarHeaderBarber} height={8} width={8} alt="Scissors" />
                            </View>
                            <View width='10%' />
                            <View width='40%' style={flexes.justifyContentCenter}>
                                <Text color="#6a7182" fontSize={15}>Barbeiro</Text>
                                <Text color="#6a7182" fontSize={12}>
                                    {barbers.map((value) => {
                                        if (barberSelected == value.id) {
                                            return value.name
                                        }

                                    })}
                                </Text>
                            </View>
                        </View>

                    </View>

                </View>

                <Calendar
                    testID={iDS.calendars.FIRST}
                    enableSwipeMonths
                    style={flexes.calendar}
                    minDate={todayEnUS}
                    hideExtraDays={true}
                    onDayPress={onDayPress}
                    markedDates={{ ...marked, ...datesFree, ...datesOccuped }}

                />
            </Fragment>
        )


    }, [barberSelectedSettings, selected, servicesName])

    useEffect(() => {

        getAllServices()
        getAllBarbers()

    }, [])

    const onOpenBarbeiro = () => {
        setModal(
            <Box flexDir="row">
                <View>
                    <Avatar bg="primary.300"
                        source={barberNoPreferencies}
                        size="xl"
                        ml="3"
                        onTouchEnd={() => addSelectedBarber(0)}
                    >
                        AJ
                        {barberSelected == 0 &&
                            (
                                <Avatar.Badge display="flex" alignItems="center" justifyContent="center">
                                    <FontAwesomeIcon color="white" icon={faCheck} />
                                </Avatar.Badge>
                            )
                        }
                    </Avatar>

                    <Text
                        color="muted.800"
                        ml="3"
                        maxW={120}
                    >
                        Filipe Palheta
                    </Text>
                </View>

                {loading ? <ActivityIndicator /> : barbers.map((bar, i) => (
                    <View>
                        <Avatar
                            key={i}
                            bg="primary.300"
                            source={{
                                uri: bar.foto_site
                            }}
                            size="xl"
                            ml="3"
                            onTouchEnd={() => addSelectedBarber(bar.id)}
                        >  {bar.name}
                            {bar.id == barberSelected &&
                                (
                                    <Avatar.Badge display="flex" alignItems="center" justifyContent="center">
                                        <FontAwesomeIcon color="white" icon={faCheck} />
                                    </Avatar.Badge>
                                )
                            }

                        </Avatar>

                        <Text
                            color="muted.800"
                            ml="3"
                            maxW={120}
                        >
                            {bar.name}
                        </Text>
                    </View>
                ))}



            </Box>
        )
        setSnapPoint(400)
        setHeightContentModal(350)
        setButtonModal(
            <Button colorScheme="muted" ml="6" mr="6" onTouchEnd={closeModal}>
                FECHAR
            </Button>
        )
        modalizeRef.current?.open();
    };

    const onOpenServicos = () => {
        setModal(
            <ScrollView>
                {loading ? <ActivityIndicator /> : (
                    <View
                        height="100%"
                        display="flex"
                        flexDir="column"
                    >

                        <ReactNativeItemSelect
                            tickPosition="topRight"
                            data={barberServices}
                            multiselect={true}
                            styles={{
                                itemBoxHighlight: {
                                    width: 288,
                                    height: 75
                                },
                                rowWrapper: {
                                    display: 'flex',
                                    flexDirection: 'column'
                                },
                            }}
                            itemComponent={
                                item => {
                                    const value = numeral(item.valor).format('0.00')
                                    const formatedValue = value.toString().replace(".", ",")
                                    return (
                                        <View
                                            w="100%"
                                            h="100%"
                                            flexDirection="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                        >

                                            <Text style={{ fontSize: 21, paddingLeft: 20 }}>{item.servico_nome}</Text>
                                            <Text style={{ ...flexes.serviceStyle, fontSize: 17 }}>R$ {formatedValue}</Text>
                                        </View>
                                    )

                                }
                            }
                            submitBtnTitle={`ESCOLHER`}

                            onSubmit={item => addSelectedService(item)}
                        />


                    </View>
                )}
            </ScrollView>

        )
        setSnapPoint(400)
        setHeightContentModal(350)
        setButtonModal(
            <Button colorScheme="muted" ml="6" mr="6" onTouchEnd={closeModal}>
                FECHAR
            </Button>
        )
        modalizeRef.current?.open();
    }

    const onOpenDatetime = () => {

        modalCalendar.current?.open();
    }


    const getAllServices = async () => {
        setLoader(true)
        try {
            const response = await fetch(`${API_URL}/services`);
            const json = await response.json();
            setServices(json.services);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const getAllBarbers = async () => {
        try {
            setLoading(true)
            const res = await fetch(`${API_URL}/barbers`)
            const json = await res.json()
            setBarbers(json.barbers)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
            setLoader(false)
        }

    }

    const getSuspendedHours = async (id) => {
        setLoader(true)
        var datesFreeFunc;
        var datesOccupieds;
        var barberSettingsFunc;
        try {
            const res = await fetch(`${API_URL}/hours-suspendeds?barberID=${id}`)
            const json = await res.json()

            datesFreeFunc = json.datesFree
            datesOccupieds = json.datesOccupeds
            barberSettingsFunc = json.arrayDateHoursSchelueds
        } catch (error) {
            console.log(error)
        } finally {
            setDatesFree(datesFreeFunc)
            setDatesFreeObj(datesFreeFunc)
            if (datesOccupieds.length > 0) {
                setDatesOccuped(datesOccupieds)
            }
            setBarberSelectedSettings(barberSettingsFunc)
            setLoader(false)

        }


    }

    const closeModal = () => {
        modalizeRef.current?.close();
    }

    const addSelectedBarber = (id) => {
        setBarberSelected(id)
        getSuspendedHours(id)
        closeModal()
    }

    const scheduleHandler = async () => {
        const storage = await AsyncStorage.getItem('@login')
        if (storage) {
            const user = JSON.parse(storage)
            var dados = {
                idUser: user.id,
                services: selectedServices,
                barber: barberSelected,
                data: dateSelected ? dateSelected : todayEnUS,
                hora: hourSelected
            }

            console.log(dados)
            try {
                setErrorSchedule(false)
                setErrorMsgSchedule('')
                setLoaderBtn(true)
                const URL = API_URL + '/agendar'
                const response = await fetch(URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dados) // body data type must match "Content-Type" header
                });
                const res = await response.json(); // parses JSON response into native JavaScript objects
                if (res.success) {
                    navigation.navigate('Historico', {'param': 'teste'})
                } else {
                    setErrorSchedule(true)
                    setErrorMsgSchedule(res.msg)
                    modalCalendar.current?.close();
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoaderBtn(false)
            }
        } else {
            navigation.navigate('Login')
        }


    }

    return (
        <View height="100%">
            {errorSchedule && (
                <Alert maxW="400" status="danger" colorScheme="info">
                    <VStack space={2} flexShrink={1} w="100%">
                        <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                            <HStack flexShrink={1} space={2} alignItems="center">
                                <Alert.Icon />
                                <Text fontSize="md" fontWeight="medium" color="coolGray.800">
                                    Erro ao agendar
                                </Text>
                            </HStack>
                            <IconButton variant="unstyled" _focus={{
                                borderWidth: 0
                            }} icon={<CloseIcon size="3" />} _icon={{
                                color: "coolGray.600"
                            }} />
                        </HStack>
                        <Box pl="6" _text={{
                            color: "coolGray.600"
                        }}>
                            {errorMsgSchedule}
                        </Box>
                    </VStack>
                </Alert>
            )}

            <Modalize
                ref={modalizeRef}
                snapPoint={snapPoint}
                modalHeight={snapPoint}
                closeOnOverlayTap={true}
            >

                <ScrollView style={{ height: heightContentModal }} p="5" display="flex" flexDir="row">
                    {modal}

                </ScrollView>
                {buttonModal}
            </Modalize>
            <Modalize
                ref={modalCalendar}
                snapPoint={600}
                modalHeight={600}
            >
                {calendarState}

                {calendarLoader &&
                    <Lottie source={require('./../assets/icons/loading_ring_medium.json')} autoPlay loop />
                }
                <View mt="1" background="#efefef" p={5} flexDir="row">
                    <ScrollView
                        horizontal={true}
                        contentContainerStyle={{
                            flexDirection: 'row',
                        }}
                    >
                        {hours.map((h, i) => (
                            <Box
                                key={i}
                                style={{
                                    ...flexes.hourStyle,
                                    borderColor: hourColor[`${i}`]
                                        ? "#00adf5"
                                        : "#CCCC",
                                }}

                                onTouchEnd={() => selectDate(i, h.hora)}
                            >
                                <Text
                                    style={{
                                        color: '#767676',
                                        fontWeight: 'bold',
                                        fontSize: 16,
                                    }}
                                >
                                    {h.hora}
                                </Text>
                            </Box>
                        ))}
                    </ScrollView>
                </View>
                <View display="flex" flexDir="row" mt="1">
                    <Button colorScheme="muted" maxWidth={40} ml="6" onPress={closeModal} >FECHAR</Button>
                    <Button colorScheme="success" isLoading={loaderBtn} width="60%" ml="2" onPress={scheduleHandler} >AGENDAR</Button>
                </View>

            </Modalize>
            <View backgroundColor="#171717" height="50%" style={flexes.justifyCenter}>
                <Container >
                    <Heading color="primary.50" mt={5}>
                        Agendamento
                    </Heading>
                </Container>
                <Center height="100%" mt={-5}>
                    <Image w="190px" h="74px" source={logo} alt="Logo Image" />
                </Center>

            </View>

            <View backgroundColor="#e7e3db" height="50%">

                <Center>
                    <TouchableOpacity
                        onPress={onOpenServicos}
                        style={flexes.firstButtonAgendamentoStyle}

                    >
                        <View height='100%' display="flex" flexDirection="row">
                            <View style={[flexes.buttonRightImageStyle, { backgroundColor: selectedServices.length > 0 ? '#3b82f6' : '#f1f1f1' }]}>
                                <Image source={scissors} height={8} width={8} alt="Scissors" />
                            </View>
                            <View width='10%' />
                            {selectedServices.length > 0 ? (
                                <View width='40%' style={flexes.justifyContentCenter}>
                                    <Text color="#6a7182" fontSize={15}>Serviços</Text>
                                    <Text color="#6a7182" fontSize={12}>
                                        {servicesName}
                                    </Text>
                                </View>
                            ) : (
                                <View width='40%' style={flexes.justifyContentCenter}>
                                    <Text color="#6a7182" fontSize={21}>Serviços</Text>
                                </View>
                            )}
                            <Center width='28%' alignItems="flex-end">
                                <FontAwesomeIcon color="#c7c7cf" icon={faAngleRight} />
                            </Center>
                        </View>

                    </TouchableOpacity>


                    <TouchableOpacity
                        onPress={onOpenBarbeiro}
                        style={[
                            flexes.buttonAgendamentoStyle,
                            {
                                top: 40,
                                opacity: selectedServices.length == 0 ? 0.5 : 1
                            }
                        ]}

                        disabled={selectedServices.length == 0 ? true : false}

                    >
                        <View height='100%' display="flex" flexDirection="row">
                            <View style={[flexes.buttonRightImageStyle, { backgroundColor: barberSelected ? '#3b82f6' : '#f1f1f1' }]}>
                                <Image source={barber} height={8} width={8} alt="Scissors" />
                            </View>
                            <View width='10%' />
                            {barberSelected ? (
                                <View width='40%' style={flexes.justifyContentCenter}>
                                    <Text color="#6a7182" fontSize={15}>Barbeiro</Text>
                                    <Text color="#6a7182" fontSize={12}>
                                        {barbers.map((value) => {
                                            if (barberSelected == value.id) {
                                                return value.name
                                            }

                                        })}
                                    </Text>
                                </View>
                            ) : (
                                <View width='40%' style={flexes.justifyContentCenter}>
                                    <Text color="#6a7182" fontSize={21}>Barbeiro</Text>
                                </View>
                            )}

                            <Center width='28%' alignItems="flex-end">
                                <FontAwesomeIcon color="#c7c7cf" icon={faAngleRight} />
                            </Center>
                        </View>

                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onOpenDatetime}
                        style={[flexes.buttonAgendamentoStyle, { top: 120, opacity: barberSelected ? 1 : 0.5 }]}
                        disabled={barberSelected ? false : true}
                    >
                        <View height='100%' display="flex" flexDirection="row">
                            <View style={flexes.buttonRightImageStyle}>
                                <Image source={schedule} height={8} width={8} alt="Scissors" />
                            </View>
                            <View width='10%' />
                            <View width='40%' style={flexes.justifyContentCenter}>
                                <Text color="#6a7182" fontSize={21}>Data e Hora</Text>
                            </View>
                            <Center width='28%' alignItems="flex-end">
                                <FontAwesomeIcon color="#c7c7cf" icon={faAngleRight} />
                            </Center>
                        </View>

                    </TouchableOpacity>

                </Center>
                {loader &&
                    <Lottie source={require('./../assets/icons/loading_ring_medium.json')} autoPlay loop style={{
                        marginTop: -90
                    }} />
                }

            </View>

        </View>

    );
}


export default HomeScreen

const styles = StyleSheet.create({
    dayView: {
        display: 'flex',
        alignItems: 'center'
    }
});