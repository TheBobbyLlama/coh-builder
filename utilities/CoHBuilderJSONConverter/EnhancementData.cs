using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoHBuilderJSONConverter
{
    public class EnhancementData
    {
        public int StaticIndex;
        public string Name;
        public string ShortName;
        public string Desc;
        public int TypeID;
        public int SubTypeID;
        public int[] ClassID;
        public string Image;
        public int nIDSet;
        public string UIDSet;
        public EnhancementEffectData[] Effect;
        public double EffectChance;
        public int LevelMin;
        public int LevelMax;
        public bool Unique;
        public string RecipeName;
        public int RecipeIDX;
        public string UID;
        public double Probability;
        public bool HasEnhEffect;
        public bool HasPowerEffect;
        public string LongName;
        public int Rarity; // CUSTOM FIELD, WILL BE FILLED BY PROGRAM
    }

    public class EnhancementEffectData
    {
        public int Mode;
        public EnhancementEffectMetadata Enhance;
        public double Multiplier;
        EnhancementEffectFX[] FX;
    }

    public class EnhancementEffectMetadata
    {
        public int ID;
        public int SubID;
    }

    public class EnhancementEffectFX
    {
        public string MagnitudeExpression;
        public double Probability;
        public bool DisplayPercentage;
        public double BaesProbability;
        public string Reward;
        public string EffectId;
        public string Special;
        public int EffectType;
        public string Summon;
        public int nSummon;
        public bool Resistible;
        public string UIDClassName;
        public int nIDClassName;
        public bool isEnhancementEffect;
        public string Aspect;
        public string ModifierTable;
        public int nModifierTable;
        public string PowerFullName;
        public int Absorbed_PowerType;
        public int Absorbed_Power_nID;
        public int Absorbed_Class_nID;
        public int Absorbed_EffectID;
        public string Override;
        public double AtrOrigAccuracy;
        public double AtrOrigActivatePeriod;
        public double AtrOrigArc;
        public double AtrOrigCastTIme;
        public double AtrOrigEnduranceCost;
        public double AtrOrigInterruptTime;
        public double AtrOrigMaxTargets;
        public double AtrOrigRadius;
        public double AtrOrigRange;
        public double AtrOrigRechargeTime;
        public double AtrOrigSecondaryRange;
        public double AtrModAccuracy;
        public double AtrModActivatePeriod;
        public double AtrModArc;
        public double AtrModCastTime;
        public double AtrModEnduranceCost;
        public double AtrModInterruptTime;
        public double AtrModMaxTargets;
        public double AtrModRadius;
        public double AtrModRange;
        public double AtrModRechargeTime;
        public double AtrModSecondaryRange;
        public EnhancementConditional[] ActiveConditionals;
        public int nOverride;
    }

    public class EnhancementConditional
    {
    }
}
