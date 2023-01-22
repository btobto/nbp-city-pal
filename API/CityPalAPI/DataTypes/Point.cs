namespace CityPalAPI.DataTypes;
public class Point
{
    public Point(int srId, double x, double y)
    {
        this.SrId = srId;
        this.X = x;
        this.Y = y;
    }

    public int SrId { get; }

    public double X { get; }

    public double Y { get; }
}
