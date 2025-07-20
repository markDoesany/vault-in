import { 
        createVaultEntry, 
        updateVaultEntry, 
        softDeleteVaultEntry,
        listVaultEntries
    } from "../services/vaultServices.js";

async function handleCreateVaultEntry(req, res, next){
    try {
        const {id: userId} = req.user;
        const {service_name, encrypted_username, encrypted_password, iv, notes, tags} = req.body;
        

        if (!service_name || !encrypted_username || !encrypted_password || !iv){
            return res.status(400).json({error: "Service name, encrypted username, encrypted password, and IV are required"});
        }

        const ip = req.ip || req.headers['x-forwarded-for'];
        const userAgent = req.headers['user-agent'];

        const result = await createVaultEntry(
                                                userId, {
                                                service_name, 
                                                encrypted_username, 
                                                encrypted_password, 
                                                iv, 
                                                notes, 
                                                tags},
                                                ip, 
                                                userAgent);

        if (!result.success){
            return res.status(400).json({error: result.message});
        }

        return res.status(200).json({message: "Vault entry created successfully"});

    } catch (error) {
        next(error);
    }
}

async function handleUpdateVaultEntry(req, res, next){
    try {
        const {id: userId} = req.user;
        const {entry_id, service_name, encrypted_username, encrypted_password, iv, notes, tags} = req.body;

        if (!entry_id || !service_name || !encrypted_username || !encrypted_password || !iv){
            return res.status(400).json({error: "Entry ID, service name, encrypted username, encrypted password, and IV are required"});
        }

        const ip = req.ip || req.headers['x-forwarded-for'];
        const userAgent = req.headers['user-agent'];

        const result = await updateVaultEntry(
                                                userId, {
                                                entry_id,
                                                service_name, 
                                                encrypted_username, 
                                                encrypted_password, 
                                                iv, 
                                                notes, 
                                                tags},
                                                ip, 
                                                userAgent);

        if (!result.success){
            return res.status(400).json({error: result.message});
        }

        return res.status(200).json({message: "Vault entry updated successfully"});
    } catch (error) {
        next(error);
    }
}

async function handleSoftDeleteVaultEntry(req, res, next){
    try {
        const { id: userId } = req.user;
        const { entry_id } = req.body;

        if (!entry_id){
            return res.status(400).json({error: "Entry ID is required"});
        }

        const ip = req.ip || req.headers['x-forwarded-for'];
        const userAgent = req.headers['user-agent'];

        const result = await softDeleteVaultEntry(userId, entry_id, ip, userAgent);

        if (!result.success){
            return res.status(400).json({error: result.message});
        }

        return res.status(200).json({message: "Vault entry deleted successfully"});
    } catch (error) {
        next(error);
    }
}

async function handleListVaultEntries(req, res, next){
    try {
        const {id: userId} = req.user;
        const entries = await listVaultEntries(userId);
        return res.status(200).json({entries});
    } catch (error) {
        next(error);
    }
}

export {
    handleCreateVaultEntry,
    handleUpdateVaultEntry,
    handleSoftDeleteVaultEntry,
    handleListVaultEntries
}