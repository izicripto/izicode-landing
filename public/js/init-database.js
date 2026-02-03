/**
 * Script de Inicialização do Banco de Dados
 * Popula Firestore com dados iniciais (badges, desafios públicos)
 * 
 * IMPORTANTE: Executar apenas UMA VEZ após deploy
 */

import { db, collection, addDoc, setDoc, doc } from './firebase-config.js';
import { gamificationSystem } from './gamification.js';
import { projects } from './projects-data.js';

// ==================== BADGES ====================

async function initializeBadges() {
    console.log('📛 Inicializando badges...');

    const badges = gamificationSystem.badges;
    const badgesCollection = collection(db, 'badges');

    for (const badge of badges) {
        try {
            await setDoc(doc(db, 'badges', badge.id), {
                id: badge.id,
                name: badge.name,
                description: badge.description,
                icon: badge.icon,
                rarity: badge.rarity,
                // Não salvar a função condition, apenas os metadados
                conditionType: badge.id // Usar ID como referência
            });
            console.log(`✅ Badge criado: ${badge.name}`);
        } catch (error) {
            console.error(`❌ Erro ao criar badge ${badge.name}:`, error);
        }
    }

    console.log(`✅ ${badges.length} badges inicializados!`);
}

// ==================== CHALLENGES ====================

async function initializeChallenges() {
    console.log('🎯 Inicializando desafios públicos...');

    const challengesCollection = collection(db, 'challenges');
    let count = 0;

    for (const project of projects) {
        try {
            // Mapear dificuldade
            const difficultyMap = {
                'Básico': 'easy',
                'Iniciante': 'easy',
                'Intermediário': 'medium',
                'Avançado': 'hard'
            };

            const difficulty = difficultyMap[project.difficulty] || 'medium';

            // Calcular XP baseado na dificuldade
            const xpRewards = { easy: 10, medium: 15, hard: 25 };
            const xpReward = xpRewards[difficulty];

            // Determinar plataforma principal
            const platformMap = {
                'Scratch': 'scratch',
                'Arduino': 'arduino',
                'Micro:bit': 'microbit',
                'NEPO': 'nepo',
                'Blocos': 'blockly'
            };
            const platform = platformMap[project.tools[0]] || 'other';

            await addDoc(challengesCollection, {
                title: project.title,
                description: project.description,
                difficulty,
                xpReward,
                platform,
                content: project.content || '',
                duration: project.duration,
                grade: project.grade,
                tools: project.tools,
                ods: project.ods || '',
                bncc: project.bncc || [],
                image: project.image || '',
                createdBy: 'system', // Desafios oficiais
                isPublic: true,
                createdAt: new Date()
            });

            count++;
            console.log(`✅ Desafio criado: ${project.title}`);
        } catch (error) {
            console.error(`❌ Erro ao criar desafio ${project.title}:`, error);
        }
    }

    console.log(`✅ ${count} desafios inicializados!`);
}

// ==================== LEARNING MATERIALS ====================

async function initializeLearningMaterials() {
    console.log('📚 Inicializando materiais de aprendizagem...');

    const materials = [
        {
            id: 'arduino-basics',
            platform: 'arduino',
            title: 'Arduino para Iniciantes',
            description: 'Aprenda os fundamentos do Arduino',
            type: 'course',
            modules: [
                {
                    id: 'arduino-101',
                    title: 'O que é Arduino?',
                    type: 'article',
                    duration: '10min',
                    content: `
# O que é Arduino?

Arduino é uma plataforma de prototipagem eletrônica open-source baseada em hardware e software fáceis de usar.

## Componentes Principais

- **Microcontrolador**: Cérebro do Arduino
- **Pinos Digitais**: Entrada/saída digital (0V ou 5V)
- **Pinos Analógicos**: Leitura de sensores (0-1023)
- **Alimentação**: USB ou bateria externa

## Primeiros Passos

1. Instale a Arduino IDE
2. Conecte o Arduino via USB
3. Carregue o exemplo "Blink"
4. Veja o LED piscar!
                    `
                },
                {
                    id: 'arduino-sensors',
                    title: 'Trabalhando com Sensores',
                    type: 'video',
                    duration: '20min',
                    videoUrl: 'https://www.youtube.com/watch?v=example'
                }
            ]
        },
        {
            id: 'scratch-basics',
            platform: 'scratch',
            title: 'Scratch para Educadores',
            description: 'Crie jogos e animações com Scratch',
            type: 'course',
            modules: [
                {
                    id: 'scratch-101',
                    title: 'Introdução ao Scratch',
                    type: 'article',
                    duration: '15min',
                    content: `
# Introdução ao Scratch

Scratch é uma linguagem de programação visual criada pelo MIT para ensinar lógica de programação.

## Interface

- **Palco**: Onde a ação acontece
- **Sprites**: Personagens e objetos
- **Blocos**: Comandos de programação
- **Scripts**: Sequência de blocos

## Conceitos Básicos

- Eventos (quando clicar em 🏴)
- Movimento (mova 10 passos)
- Aparência (diga "Olá!")
- Som (toque som)
                    `
                }
            ]
        }
    ];

    const materialsCollection = collection(db, 'learningMaterials');

    for (const material of materials) {
        try {
            await setDoc(doc(db, 'learningMaterials', material.id), material);
            console.log(`✅ Material criado: ${material.title}`);
        } catch (error) {
            console.error(`❌ Erro ao criar material ${material.title}:`, error);
        }
    }

    console.log(`✅ ${materials.length} materiais inicializados!`);
}

// ==================== EXECUTAR TUDO ====================

export async function initializeDatabase() {
    console.log('🚀 Iniciando população do banco de dados...\n');

    try {
        await initializeBadges();
        console.log('\n');

        await initializeChallenges();
        console.log('\n');

        await initializeLearningMaterials();
        console.log('\n');

        console.log('✅ ✅ ✅ BANCO DE DADOS INICIALIZADO COM SUCESSO! ✅ ✅ ✅');
        console.log('\nPróximos passos:');
        console.log('1. Deploy das Firestore Rules: firebase deploy --only firestore:rules');
        console.log('2. Testar criação de usuário via login');
        console.log('3. Testar criação de turma (professor)');
        console.log('4. Testar atribuição de desafio');

    } catch (error) {
        console.error('❌ Erro fatal na inicialização:', error);
    }
}

// Auto-executar se estiver em modo de inicialização
if (window.location.search.includes('init=true')) {
    console.log('🔧 Modo de inicialização detectado!');
    console.log('⚠️ ATENÇÃO: Este script deve ser executado apenas UMA VEZ!');
    console.log('Aguardando confirmação...\n');

    // Adicionar botão de confirmação
    const confirmButton = document.createElement('button');
    confirmButton.textContent = '🚀 INICIALIZAR BANCO DE DADOS';
    confirmButton.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px 40px;
        font-size: 20px;
        font-weight: bold;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 9999;
    `;

    confirmButton.onclick = async () => {
        confirmButton.disabled = true;
        confirmButton.textContent = '⏳ Inicializando...';
        await initializeDatabase();
        confirmButton.textContent = '✅ Concluído!';
        confirmButton.style.background = 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
    };

    document.body.appendChild(confirmButton);
}
