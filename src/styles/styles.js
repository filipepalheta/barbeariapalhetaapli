import { StyleSheet } from "react-native"

export const flexes = StyleSheet.create({
    centerCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerTop: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    justifyCenter: {
        alignItems: 'center'
    },
    tabBottomStyle: {

    },
    firstButtonAgendamentoStyle: {
        position: 'absolute',
        bottom: 0,
        top: 0,
        right: 20,
        marginTop: -40,
        left: 20,
        elevation: 5,
        backgroundColor: '#ffffff',
        borderRadius: 15,
        height: 65,
        shadowColor: 'brown',
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5
    },
    buttonAgendamentoStyle: {
        position: 'absolute',
        bottom: 0,
        right: 20,
        left: 20,
        elevation: 5,
        backgroundColor: '#ffffff',
        borderRadius: 15,
        height: 65,
        shadowColor: 'brown',
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5
    },
    buttonIconSeparatorStyle: {
        backgroundColor: '#fff',
        width: 1,
        height: 40,
    },
    buttonTextStyle: {
        color: '#fff',
        marginBottom: 4,
        marginLeft: 10,
    },
    buttonRightImageStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f1f1f1',
        width: '20%',
        borderRightColor: '#d8d8d8',
        borderRightWidth: 1
    },
    justifyContentCenter: {
        display: 'flex',
        justifyContent: 'center'
    },
    serviceStyle: {
        color: '#696969',
        fontWeight: 'bold',
    },
    calendar: {
        marginBottom: 10
    },
    switchContainer: {
        flexDirection: 'row',
        margin: 10,
        alignItems: 'center'
    },
    switchText: {
        margin: 10,
        fontSize: 16
    },
    disabledText: {
        color: 'grey'
    },
    defaultText: {
        color: 'purple'
    },
    customCalendar: {
        height: 250,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey'
    },
    customDay: {
        textAlign: 'center'
    },
    customHeader: {
        backgroundColor: '#FCC',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginHorizontal: -4,
        padding: 8
    },
    customTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    customTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#00BBF2'
    },
    hourStyle: {
        maxWidth: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 9,
        margin: 4,
        borderWidth: 2,
    },
    headerCalendarStyle: {
        elevation: 5,
        backgroundColor: '#ffffff',
        height: 65,
        shadowColor: 'brown',
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5
    }
})

