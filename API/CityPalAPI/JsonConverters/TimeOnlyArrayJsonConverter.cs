using Newtonsoft.Json;
using System.Globalization;

namespace CityPalAPI.JsonConverters;

public class TimeOnlyArrayJsonConverter : JsonConverter<TimeOnly[]>
{
    private const string Format = "HH:mm:ss'Z'";

    public override TimeOnly[]? ReadJson(JsonReader reader, Type objectType, TimeOnly[]? existingValue, bool hasExistingValue, Newtonsoft.Json.JsonSerializer serializer)
    {
        if (reader.TokenType == JsonToken.StartArray)
        {
            List<TimeOnly> timeOnlyList = new List<TimeOnly>();
            while (reader.TokenType != JsonToken.EndArray)
            {
                string? time = reader.ReadAsString();

                if (time is null)
                    continue;

                if (TimeOnly.TryParseExact(time, Format, CultureInfo.InvariantCulture, DateTimeStyles.None, out TimeOnly result))
                {
                    timeOnlyList.Add(result);
                }
                else
                {
                    throw new JsonException("Invalid time format: " + time);
                }
            }

            return timeOnlyList.ToArray();
        }
        else
        {
            throw new JsonException("Expected start of array.");
        }
    }

    public override void WriteJson(JsonWriter writer, TimeOnly[]? value, Newtonsoft.Json.JsonSerializer serializer)
    {
        if (value is null) return;

        writer.WriteStartArray();
        foreach (var s in value)
        {
            writer.WriteRaw(s.ToString(Format, CultureInfo.InvariantCulture));
        }
        writer.WriteEndArray();
    }
}