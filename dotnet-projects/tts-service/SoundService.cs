using NAudio.Wave;
using System.Speech.AudioFormat;
using System.Speech.Synthesis;
using System.Threading.Channels;

public class SoundService
{
    public static Channel<Call> InputChannel = Channel.CreateUnbounded<Call>();

    static int i = 0;

    public static async Task SpeakAsync()
    {
        await foreach (var item in InputChannel.Reader.ReadAllAsync())
        {
            try
            {
                if (i > 200)
                    i = 0;

                string tmpfile = $"sounds/{++i}.wav";
                string outfile = tmpfile.Substring(0, tmpfile.Length - ".wav".Length) + ".mp3";

                using (var ss = new SpeechSynthesizer())
                {
                    SpeechAudioFormatInfo formatInfo = new(16000, AudioBitsPerSample.Sixteen, AudioChannel.Mono);
                    ss.SetOutputToWaveFile(tmpfile, formatInfo);
                    ss.Speak(item.content);
                }

                using (var reader = new MediaFoundationReader(tmpfile))
                {
                    MediaFoundationEncoder.EncodeToMp3(reader, outfile);
                }

                item.url = $"/tts/{outfile}?v={item.id}";

                File.Delete(tmpfile);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }
        }
    }
}

public class Call
{
    public string id { get; set; } = Guid.NewGuid().ToString();
    public string content { get; set; } = "";
    public string? url { get; set; }
}
