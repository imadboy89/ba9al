import { Platform, AsyncStorage } from 'react-native';


class LocalStorage{
    constructor() {
        this.settings = {"language":"en","image_quality":0.2,"ratio":"4:3","autoFocus":true,"availableRatios":[],"LastRemovedHistory":null}

        //this.settings = this.getSettings();
        this.languages = {"fr":"Français","en":"English","dr":"Darija","ar":"العربية"}
        this.imageQualities = {"Low":0.1,"Meduim":0.2,"High":0.4};
    }
    getDateTime(){
        const date_ob = new Date();
        const date  = ("0" +date_ob.getDate()).slice(-2);
        const month = ("0" + (date_ob.getMonth() + 1) ).slice(-2);
        const year  = date_ob.getFullYear();
        const hours = ("0" +date_ob.getHours()).slice(-2);
        const min   = ("0" +date_ob.getMinutes()).slice(-2);
        const sec   = ("0" +date_ob.getSeconds()).slice(-2);
        return year + '-' + month + '-' + date + ' ' + hours + ':' + min;
      }
    getSettings = async key => {
        let settings = await AsyncStorage.getItem('settings');
        if(settings && settings!="[]"){
            settings = JSON.parse(settings);
        }else{
            await AsyncStorage.setItem('settings', JSON.stringify(this.settings));
            settings = this.settings;
        }
        
        if (key) {
            if(key in settings){
                return settings[key] ;
            }else{
                settings[key] = this.settings[key];
                await AsyncStorage.setItem('settings', JSON.stringify(settings));
                return settings[key];
            }
        } else {
            const settings_keys = Object.keys(this.settings);
            for (let i = 0; i < settings_keys.length; i++) {
                const key = settings_keys[i];
                if( !(key in settings) ){
                    settings[key] = this.settings[key];
                }
            }
            await AsyncStorage.setItem('settings', JSON.stringify(settings));
            return settings;
        }
    };
    setPurchaseHistory = async (PList) => {
        PList["title"] = this.getDateTime();
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
    clearHistory= async () => {
        await AsyncStorage.setItem('history', JSON.stringify([]));
        return this.LastRemovedHistory(this.getDateTime());
    };
    LastRemovedHistory = async (date=null) =>{
        if(date){
            await AsyncStorage.setItem('LastRemovedHistory', date);
        }else{
            const out = await AsyncStorage.getItem('LastRemovedHistory');
            return out;
        }
    }
    setCredentials = async (email, password) => {
        let crendentials = {"email":email,"password":password} ;
        await AsyncStorage.setItem('crendentials', JSON.stringify(crendentials));
    };
    set = async (key, value) => {
        await AsyncStorage.setItem(key, value);
    };
    get = async (key, value) => {
        await AsyncStorage.setItem(key, value);
    };
    getCredentials = async () => {
        let crendentials = await AsyncStorage.getItem('crendentials');
        if(crendentials){
            return JSON.parse(crendentials);
        }else{
            crendentials = {"email":"","password":""} ;
            await this.setCredentials("","");
            return crendentials;
        }
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