import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import 'client.css'
import '../App.css'
import axios from 'axios'
import apiClient from "../axiosConfig";

function Main() {
    const [topic, setTopic] = useState<string>('');
    const [essay, setEssay] = useState<string>('');
    const [model, setModel] = useState<string>('gemini-2.5-flash');
    const [language, setLanguage] = useState<string>('English');
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [updateLoading, setUpdateLoading] = useState<boolean>(false);
    const [logoutLoading, setLogoutLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    

    const update_data = async (e: {preventDefault: () => void}) => {
        e.preventDefault();
        const data = [language, apiKey];

        setUpdateLoading(true);
        setError(null);
        setSuccess(null);

        try{
            const response = await apiClient.post('/api/storage', data)
            console.log("storage success", response.data)
            setSuccess("Success")
        } catch(err) {
            if (axios.isAxiosError(err)) {
                const serverError = err.response?.data?.detail || 'Something went wrong'                
                setError(serverError)
            };
        } finally {
            setUpdateLoading(false);
        };
    };

    const scoring = async (e: {preventDefault: () => void}) => {
        e.preventDefault();
        const data = [apiKey, model, topic, essay, language];

        setLoading(true);
        setError(null);

        try{
            const response = await apiClient.post('/api/response', data)
            console.log("success", response.data)

            const overall_score = response.data.Overall_score;
            const TR = response.data.TR;
            const LR = response.data.LR;
            const CC = response.data.CC;
            const GRA = response.data.GRA;
            const reason = response.data.reason;
            const improvement = response.data.improvement;
        } catch(err) {
            if (axios.isAxiosError(err)){
                const serverError = err.response?.data?.detail || 'Something went wrong'
                setError(serverError)
            };
        } finally {
            setLoading(false);
        };

    };

    const Logout = () => {
        setLogoutLoading(false);
        setSuccess(null);
        setError(null);

        try{
            localStorage.removeItem('accessToken')
            setSuccess("Logout success")
            navigate('/login')
        } catch(err) {
            console.log(err);
            setError("Logout failed")
        } finally {
            setLogoutLoading(false);
        };
    }

}

export default Main