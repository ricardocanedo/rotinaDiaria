import { Activity } from '../interfaces/activity.interface';

const availableActivities: Activity[] = [
    
    // Higiene
    { name: 'Escovar Dentes', icon: '🦷', color: '#3B82F6', category: 'Higiene', description: 'Escovar os dentes após as refeições', imageSrc: '' },
    { name: 'Tomar Banho', icon: '🚿', color: '#06B6D4', category: 'Higiene', description: 'Tomar banho completo', imageSrc: '' },
    { name: 'Lavar as Mãos', icon: '🧼', color: '#8B5CF6', category: 'Higiene', description: 'Lavar as mãos com sabão', imageSrc: '' },
    
    // Alimentação
    { name: 'Café da Manhã', icon: '🍳', color: '#F59E0B', category: 'Alimentação', description: 'Primeira refeição do dia', imageSrc: '' },
    { name: 'Almoço', icon: '🍽️', color: '#EF4444', category: 'Alimentação', description: 'Refeição do meio-dia', imageSrc: '' },
    { name: 'Jantar', icon: '🍲', color: '#F97316', category: 'Alimentação', description: 'Refeição da noite', imageSrc: '' },
    { name: 'Lanche', icon: '🍎', color: '#84CC16', category: 'Alimentação', description: 'Lanche saudável', imageSrc: '' },
    
    // Educação
    { name: 'Lição de Casa', icon: '✏️', color: '#10B981', category: 'Educação', description: 'Fazer tarefas escolares', imageSrc: '' },
    { name: 'Ler Livro', icon: '📚', color: '#8B5CF6', category: 'Educação', description: 'Ler por pelo menos 15 minutos', imageSrc: '' },
    { name: 'Estudar', icon: '📖', color: '#6366F1', category: 'Educação', description: 'Tempo de estudo', imageSrc: '' },
    
    // Lazer
    { name: 'Brincar', icon: '🎮', color: '#EC4899', category: 'Lazer', description: 'Tempo livre para brincar', imageSrc: '' },
    { name: 'Desenhar', icon: '🎨', color: '#F59E0B', category: 'Lazer', description: 'Atividade artística', imageSrc: '' },
    { name: 'Assistir TV', icon: '📺', color: '#A855F7', category: 'Lazer', description: 'Tempo de tela controlado', imageSrc: '' },
    
    // Sono
    { name: 'Dormir', icon: '😴', color: '#6366F1', category: 'Sono', description: 'Hora de dormir', imageSrc: '' },
    { name: 'Soneca', icon: '💤', color: '#818CF8', category: 'Sono', description: 'Cochilo da tarde', imageSrc: '' },
    
    // Atividades Físicas
    { name: 'Caminhar', icon: '🚶', color: '#10B981', category: 'Atividade Física', description: 'Caminhada leve por 15-20 minutos', imageSrc: '' },
    { name: 'Pular Corda', icon: '🪢', color: '#EF4444', category: 'Atividade Física', description: 'Exercício cardiovascular divertido', imageSrc: '' },
    { name: 'Dançar', icon: '💃', color: '#EC4899', category: 'Atividade Física', description: 'Dançar ao som de músicas favoritas', imageSrc: '' },
    { name: 'Andar de Bicicleta', icon: '🚴', color: '#3B82F6', category: 'Atividade Física', description: 'Pedalar na rua ou bicicleta', imageSrc: '' },
    { name: 'Alongamento', icon: '🧘', color: '#8B5CF6', category: 'Atividade Física', description: 'Exercícios de alongamento suave', imageSrc: '' },
    { name: 'Jogar Bola', icon: '⚽', color: '#F97316', category: 'Atividade Física', description: 'Jogar bola no quintal ou parque', imageSrc: '' },
    { name: 'Nadar', icon: '🏊', color: '#06B6D4', category: 'Atividade Física', description: 'Natação - excelente para autismo', imageSrc: '' },
   
    
    // Relaxamento e Concentração
    { name: 'Respiração Profunda', icon: '🌬️', color: '#06B6D4', category: 'Relaxamento', description: 'Exercícios de respiração para acalmar', imageSrc: '' },
    { name: 'Yoga para Crianças', icon: '🧘', color: '#8B5CF6', category: 'Relaxamento', description: 'Posturas simples de yoga', imageSrc: '' },
    { name: 'Ouvir Música Calma', icon: '🎵', color: '#818CF8', category: 'Relaxamento', description: 'Músicas relaxantes ou preferidas', imageSrc: '' },
    { name: 'Brincar com Massinha', icon: '🎨', color: '#F59E0B', category: 'Relaxamento', description: 'Atividade sensorial calmante', imageSrc: '' },
    { name: 'Quebra-cabeça', icon: '🧩', color: '#10B981', category: 'Concentração', description: 'Desenvolve foco e paciência', imageSrc: '' },
    { name: 'Colorir', icon: '🖍️', color: '#A855F7', category: 'Concentração', description: 'Atividade relaxante e focada', imageSrc: '' },
    { name: 'Contar Histórias', icon: '📖', color: '#EF4444', category: 'Concentração', description: 'Ouvir ou contar histórias', imageSrc: '' },
    { name: 'Brincadeira com Areia', icon: '🏖️', color: '#F59E0B', category: 'Relaxamento', description: 'Caixa de areia - estímulo sensorial', imageSrc: '' },
    { name: 'Bolhas de Sabão', icon: '⚪', color: '#06B6D4', category: 'Relaxamento', description: 'Soprar e estourar bolhas - diversão calmante', imageSrc: '' },
    { name: 'Abraço Apertado', icon: '🤗', color: '#EC4899', category: 'Relaxamento', description: 'Pressão profunda para acalmar', imageSrc: '' },
    { name: 'Balanço', icon: '🎪', color: '#8B5CF6', category: 'Relaxamento', description: 'Movimento rítmico calmante', imageSrc: '' },

];

export default availableActivities;
