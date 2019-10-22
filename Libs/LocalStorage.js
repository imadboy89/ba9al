import { Platform, AsyncStorage } from 'react-native';


class LocalStorage{
    constructor() {
        this.settings = {"language":"en","image_quality":0.2}

        //this.settings = this.getSettings();
        this.languages = {"fr":"Français","en":"English","dr":"Darija","ar":"العربية"}
        this.imageQualities = {"Low":0.1,"Meduim":0.2,"High":0.4}
    }
    getSettings = async key => {
        let settings = await AsyncStorage.getItem('settings');
        if(settings){
            settings = JSON.parse(settings);
        }else{
            await AsyncStorage.setItem('settings', JSON.stringify(this.settings));
            settings = this.settings;
        }
        
        if (key) {
            console.log(key,key in settings ? settings[key] : -1);
            return key in settings ? settings[key] : -1;
        } else {
            return settings;
        }
    };
    setPurchaseHistory = async (PList) => {
        history = await AsyncStorage.getItem('history');
        if (history) {
            history = JSON.parse(history);
            history.push(PList);
        }else{
            history = [PList,]
        }
        console.log("saving");
        await AsyncStorage.setItem('history', JSON.stringify(history));
    };
    
    getLastPurchaseList = async () => {
        let history = await AsyncStorage.getItem('history');
        if(history){
            history = JSON.parse(history);
        }else{
            await AsyncStorage.setItem('history', JSON.stringify([]));
            history = [];
        }
        const lastPurchaseList  = history.length >0 ? history[history.length-1] : [];
        return lastPurchaseList;
    };
    getHistory= async () => {
        let history = await AsyncStorage.getItem('history');
        if(history){
            history = JSON.parse(history);
        }else{
            await AsyncStorage.setItem('history', JSON.stringify([]));
            history = [];
        }
        return history;
    };
    setSetting = async (key, value) => {
        this.settings = await AsyncStorage.getItem('settings');
        if (this.settings) {
            this.settings = JSON.parse(this.settings);
            this.settings[key] = value;
            await AsyncStorage.setItem('settings', JSON.stringify(this.settings));
        }
    };
}

export default LocalStorage;