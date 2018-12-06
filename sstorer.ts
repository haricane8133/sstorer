import * as fs from "fs-extra";

const fname = 'sstorer.data';

export class Sstorer{
    /**
     * Denotes the session duration in minutes
     */
    duration: number;

    /**
     * After the given duration, the storage is invaid
     * @param duration Duration of each session in minutes
     */
    constructor(duration: number) {
        this.duration = duration;
        this['storage'] = {};
    }
    /**
     * This is to change the duration of each session
     * @param duration Duration of each session in minutes
     */
    setDuration(duration: number){
        this.duration = duration;
    }
    /**
     * This is to refresh the timer in the session
     * @param sessionid This is a unique key that contains it's separate data
     * @returns false - If session is already dead
     * @returns true - If session has been successfully refreshed
     */
    refreshSession(sessionid): boolean{
        if(this.isSessionActive(sessionid)){
            this['storage'][sessionid]['timestamp'] = Date.now()/1000;
            return true;
        } else {
            return false;
        }
    }
    /**
     * Starts a new unit of storage for the given sessionid
     * @param sessionid This is a unique key that contains it's separate data
     */
    spawnSession(sessionid): void{
        this['storage'][sessionid] = {};
        this.refreshSession(sessionid);
    }
    /**
     * Destroyes the storage under this sessionid
     * @param sessionid This is a unique key that contains it's separate data
     */
    killSession(sessionid): void{
        this['storage'][sessionid] = undefined;
    }
    /**
     * Returns true if the the session is active (time elapsed under 'duration')
     * @param sessionid This is a unique key that contains it's separate data
     * @returns True if the session is active
     * @returns False if the session has expired
     */
    isSessionActive(sessionid): boolean{
        if(this['storage'][sessionid] == undefined || Date.now()/1000 - this['storage'][sessionid]['timestamp'] > this.duration*60){
            this.killSession(sessionid);
            return false;
        } else{
            return true;
        }
    }
    /**
     * Add / Modify a Variable in the session storage
     * 
     * Auto refreshes the session
     * 
     * Auto performes the session activeness check
     * @param sessionid This is a unique key that contains it's separate data
     * @param paramName The name of the variable that you want to store
     * @param paramVal The value of the variabe that you want to store
     * @returns True if the session is active and the value is inserted
     * @returns False if the session has expired and storage was not done
     */
    putVar(sessionid, paramName, paramVal): boolean{
        if(this.isSessionActive(sessionid)){
            this['storage'][sessionid][paramName] = paramVal;
            this.refreshSession(sessionid);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Get the value of a variabe from the session store
     * @param sessionid This is a unique key that contains it's separate data
     * @param paramName The name of the variable that you want to get
     * @returns false if the session is not alive
     * @returns undefined if there is no such variable is declared in the session
     * @returns The value of the variable if al OK
     */
    getVar(sessionid, paramName): any {
        if(this.isSessionActive(sessionid)){
            return this['storage'][sessionid][paramName];
        } else{
            return false;
        }
    }

    /**
     * Stores the data present to the file fname
     * @returns True if successful, False if not
     */
    dump(): boolean{
        try{
            fs.writeJSONSync(fname, this);
            return true;
        } catch{ return false;}
    }

    /**
     * Loads the data from the file fname
     * @returns True if successful, False if not
     */
    load(): boolean{
        try{
            let tmp = fs.readJSONSync(fname);
            this['storage'] = tmp['storage'];
            this['duration'] = tmp['duration'];
            return true;
        } catch { return false;}
    }
}

/**
 * Returns an object that stores variabes separate for each session, for the given session duration
 * @param duration 
 * @author Hari.R aka haricane8133
 */
export function init(duration: number){
    return new Sstorer(duration)
}