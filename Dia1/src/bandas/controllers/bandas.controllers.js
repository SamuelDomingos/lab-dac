const Bandas = require("./models/index.js");

class controller {
    static get(req, res) {
        try {
            const bandas = Bandas.get();
            return res.status(200).json(bandas);
        } catch (error) {
            return res.status(400).json({ error: "Erro ao trazer as bandas." })
        }
    }

    static getId(req, res) {
        try {
            const banda = Bandas.getId(req);
            return res.status(200).json(banda);
        } catch (error) {
            return res.status(400).json({ error: "Erro ao trazer a banda." })
        }
    }

    static create(req, res) {
        try {
            const bandaCreate = Bandas.create(req);
            return res.status(200).json(bandaCreate);
        } catch (error) {
            return res.status(400).json({ error: "Erro ao criar a banda." })
        }
    }

    static update(req, res) {
        try {
            const bandaUpdate = Bandas.update(req);
            return res.status(200).json(bandaUpdate);
        } catch (error) {
            return res.status(400).json({ error: "Erro ao atualizar a empresa." })
        }        
    }

    static delete(req, res) {
        try {
            const bandaDelete = Bandas.delete(req);
            return res.status(200).json(bandaDelete);
        } catch (error) {
            return res.status(400).json({ error: "Erro ao delete banda." })
        }        
    }
}