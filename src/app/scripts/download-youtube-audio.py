from pytube import YouTube
from os import path
from moviepy.editor import *

def download_video(url, name, output_path=None):
    try:
        print("Downloading video...")
        yt = YouTube(url)

        # Seleciona a melhor resolução disponível
        video_stream = yt.streams.filter(progressive=True, file_extension='mp4').order_by('resolution').desc().first()

        if output_path is None:
          output_path = path.join('src', 'temp', 'downloads')

        video_path = video_stream.download(output_path)

        audio_path = convert_video_to_audio(video_path, path.join('src', 'temp', 'downloads', f'{name}'))
        
        print(audio_path) # Imprime o caminho do arquivo de áudio convertido
    except Exception as e:
        print("Ocorreu um erro durante o download:", e)
        delete_file(f'{output_path}/{video_stream.default_filename}')

def convert_video_to_audio(video_path, audio_path):
    try:
        print("Convertendo vídeo para áudio...")
        video = VideoFileClip(video_path)
        video.audio.write_audiofile(audio_path)
        print("Conversão concluída!")
        delete_file(video_path)
        
        sys.exit(1)
    except Exception as e:
        print("Ocorreu um erro durante a conversão:", e)
        delete_file(video_path)

def delete_file(file_path):
    if path.exists(file_path):
        os.remove(file_path)
        print(f"Arquivo {file_path} deletado com sucesso!")
    else:
        print(f"Arquivo {file_path} não encontrado!")


def main():
    if len(sys.argv) < 4:
        print("Uso: python3 script.py função parametro1 parametro2 [parametro3]")
        return

    function_name = sys.argv[1]
    param1 = sys.argv[2]
    param2 = sys.argv[3]

    if len(sys.argv) > 4:
        param3 = sys.argv[4]
        globals()[function_name](param1, param2, param3)
    else:
        globals()[function_name](param1, param2)

    print("Script executado com sucesso!")  # Mensagem de confirmação

if __name__ == '__main__':
    main()