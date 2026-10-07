const db = require('./db/db.json');

const bandas = db.bandas;

class Banda {
    static verifyUser(id) {
        const index = bandas.findIndex(banda => String(banda.id) === String(id));

        if (index === -1) {
            return null;
        }

        return index;
    }


    static create(BandaInputs) {
        const newBanda = { id: Date.now(), ...BandaInputs }
        bandas.push(newBanda)
        return newBanda;
    }
    
    static update(id, BandaInputs) {
        const index = this.verifyUser(id);

        if (index === null) {
            return null;
        }

        bandas[index] = { ...bandas[index], ...BandaInputs};

        return bandas[index];

    }   

    static get() {
        return bandas;
    }

    static getId(id) {
        const index = this.verifyUser(id);

        if (index === null) {
            return null;
        }

        return bandas[index];
    }

    static delete(id) {
        const index = this.verifyUser(id);

        if (index === null) {
            return null;
        }
        
        bandas.splice(index, 1);
        return true;
    }   
}

module.exports = Banda;