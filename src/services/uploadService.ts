export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  
  // Dados baseados no seu print
  formData.append('file', file);
  formData.append('upload_preset', 'solucell_preset'); 
  
  const cloudName = 'dtuchbvvr'; 
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Se der erro aqui, verifique se mudou para 'Unsigned' no painel
      throw new Error(errorData.error?.message || 'Falha no upload');
    }

    const data = await response.json();
    return data.secure_url; 
  } catch (error) {
    console.error('Erro no Cloudinary:', error);
    throw error;
  }
};