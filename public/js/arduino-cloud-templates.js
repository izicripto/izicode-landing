/**
 * Arduino IoT Cloud Project Templates
 * Based on Arduino IoT API (Things, Properties, Dashboards)
 */

export const ARDUINO_IOT_MODELS = {
    EXPLORATORY: {
        name: "Modelo Exploratório",
        description: "Foco em monitoramento e coleta de dados brutos para análise científica.",
        apiConcepts: ["Properties (Read-only)", "History Charts", "Things"],
        typicalWidgets: ["Value Widget", "Chart", "Gauge"]
    },
    CREATIVE: {
        name: "Modelo Criativo",
        description: "Foco em resolução de problemas onde o aluno interage com o ambiente.",
        apiConcepts: ["Properties (Read/Write)", "Variables Sync", "Widgets"],
        typicalWidgets: ["Button", "Slider", "Color Picker"]
    },
    SYSTEMS: {
        name: "Modelo de Sistemas",
        description: "Foco em automação complexa e integração entre dispositivos (M2M).",
        apiConcepts: ["Webhooks", "Cloud Scheduler", "Triggers"],
        typicalWidgets: ["Map", "Status Icon", "Console"]
    }
};

export const PROJECT_TEMPLATES = [
    {
        title: "Estação Meteorológica IoT",
        model: "EXPLORATORY",
        thing: {
            name: "WeatherStation",
            properties: [
                { name: "temperature", type: "float", update: "on_change" },
                { name: "humidity", type: "float", update: "periodic", seconds: 60 }
            ]
        },
        dashboard: {
            name: "Monitor Ambiental",
            widgets: ["Temperature Gauge", "Humidity Chart"]
        }
    },
    {
        title: "Horta Urbana Inteligente",
        model: "CREATIVE",
        thing: {
            name: "SmartGarden",
            properties: [
                { name: "soil_moisture", type: "int", update: "on_change" },
                { name: "water_pump", type: "bool", update: "manual" }
            ]
        },
        dashboard: {
            name: "Controle de Irrigação",
            widgets: ["Moisture Percent", "Pump Toggle Button"]
        }
    }
];
