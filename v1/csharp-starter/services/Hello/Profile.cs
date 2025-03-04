namespace Common;

public class Profile 
{
  public string Name { get; private set; }

  public Profile(string name) {
    this.Name = name;
  }
}
