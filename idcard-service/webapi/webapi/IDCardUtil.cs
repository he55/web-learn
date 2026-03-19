using System.Runtime.InteropServices;
using System.Text;

namespace webapi
{
    public static class IDCardUtil
    {
        public static Dictionary<string, string> readCard()
        {
            int a = InitCommExt();
            if (a <= 0)
                throw new Exception("连接读卡器失败");

            int b = Authenticate();
            if (b != 1)
                throw new Exception("读卡失败，请重试");

            int c = Read_Content(1);
            if (c != 1)
                throw new Exception("读取身份证失败，请重试");

            StringBuilder sb = new StringBuilder(128);
            var dict = new Dictionary<string, string>();

            for (int i = 0; i < 8; i++)
            {
                GetCardInfo(i, sb);
                dict.Add(getKey2(i), sb.ToString());
            }

            return dict;
        }

        static string getKey(int i)
        {
            return i switch
            {
                0 => "姓名",
                1 => "性别",
                2 => "民族",
                3 => "出生日期",
                4 => "家庭地址",
                5 => "身份证号码",
                6 => "签发机关",
                7 => "有效期",
                _ => $"{i}",
            };
        }

        static string getKey2(int i)
        {
            return i switch
            {
                0 => "xm",
                1 => "xbmc",
                2 => "mzdm",
                3 => "csrq",
                4 => "dzmc",
                5 => "gmsfhm",
                _ => $"{i}",
            };
        }

        [DllImport("termb.dll")]
        static extern int InitCommExt();//自动搜索身份证阅读器并连接身份证阅读器 

        [DllImport("termb.dll")]
        static extern int CloseComm();//断开与身份证阅读器连接 

        [DllImport("termb.dll")]
        static extern int Authenticate();//判断是否有放卡，且是否身份证 

        [DllImport("termb.dll")]
        public static extern int Read_Content(int index);//读卡操作,信息文件存储在dll所在下

        [DllImport("termb.dll")]
        static extern int GetCardInfo(int index, StringBuilder value);//解析身份证信息 
    }
}
