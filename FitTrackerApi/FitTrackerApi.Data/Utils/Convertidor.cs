using System;

namespace Utils
{
    public static class Convertidor
    {
        public static int ToInt(object? value)
        {
            if (value == null || value == DBNull.Value)
                return 0;

            if (int.TryParse(value.ToString(), out int result))
                return result;

            return 0;
        }

        public static double ToDouble(object? value)
        {
            if (value == null || value == DBNull.Value)
                return 0.0;

            if (double.TryParse(value.ToString(), out double result))
                return result;

            return 0.0;
        }

        public static float ToFloat(object? value)
        {
            if (value == null || value == DBNull.Value)
                return 0f;

            if (float.TryParse(value.ToString(), out float result))
                return result;

            return 0f;
        }

        public static DateTime ToDateTime(object? value)
        {
            if (value == null || value == DBNull.Value)
                return DateTime.MinValue;

            if (DateTime.TryParse(value.ToString(), out DateTime result))
                return result;

            return DateTime.MinValue;
        }

        public static string ToStringSafe(object? value)
        {
            return value == null || value == DBNull.Value ? string.Empty : value.ToString();
        }

        public static bool ToBool(object? value)
        {
            if (value == null || value == DBNull.Value)
                return false;

            if (bool.TryParse(value.ToString(), out bool result))
                return result;

            // Manejo de enteros como booleanos (1 = true, 0 = false)
            if (int.TryParse(value.ToString(), out int intResult))
                return intResult != 0;

            return false;
        }
    }
}